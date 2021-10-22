import { css } from '@emotion/react'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  ControllerUpdate,
  SpringValue,
  TransitionState,
  animated,
  useTransition,
} from 'react-spring'
import { useHasHydrated } from 'retil-hydration'
import { Deferred } from 'retil-support'

import {
  TransitionHandle,
  TransitionHandleRef,
  useTransitionHandle,
} from 'src/utils/transitionHandle'

import { overrideColumnTransitionHandleRefContext } from './columnTransitionContext'

const defaultInitialStyles: Record<string, any> = {
  opacity: 1,
  transform: 'none',
}
const defaultFromStyles: Record<string, any> = {
  opacity: 0,
  transform: 'translateY(-10vh)',
}
const defaultEnterStyles: ControllerUpdate<Record<string, any>> = {
  opacity: 1,
  transform: 'translateY(0vh)',
  config: {
    friction: 50,
    mass: 1,
    tension: 500,
  },
}
const defaultExitStyles: ControllerUpdate<Record<string, any>> = {
  opacity: 0,
  transform: 'translateY(10vh)',
  config: {
    clamp: true,
    friction: 15,
    mass: 1,
    tension: 300,
  },
}

interface PageHandle {
  // Only set if leaving
  leaving?: {
    complete: Promise<void>
  }

  transitionHandle: TransitionHandle | null
  transitionKey: unknown
}

type PageHandlesByKey = Map<unknown, PageHandle>

type TransitionNext = (
  controllerUpdate: ControllerUpdate<Record<string, any>, any>,
) => Promise<any>

export interface ColumnTransitionProps {
  initial?: Record<string, any>
  from?: Record<string, any>
  enter?: ControllerUpdate<Record<string, any>, any>
  exit?: ControllerUpdate<Record<string, any>, any>

  transitionKey: unknown
  transitionHandleRef?: TransitionHandleRef
}

interface ColumnTransitionMutableState {
  active: boolean
  currentKey: unknown
  pageHandlesByKey: PageHandlesByKey
}

export const ColumnTransition = memo(function ColumnTransition(
  props: JSX.IntrinsicElements['div'] & ColumnTransitionProps,
) {
  const {
    children,
    initial: initialStyles = defaultInitialStyles,
    from: fromStyles = defaultFromStyles,
    enter: enterStyles = defaultEnterStyles,
    exit: exitStyles = defaultExitStyles,
    transitionKey,
    transitionHandleRef,
    ...rest
  } = props

  const item = useMemo(
    () => ({
      children: children || React.createElement(React.Fragment),
      key: transitionKey,
    }),
    [children, transitionKey],
  )

  const activeTransitionRef = useRef<TransitionState<any> | null>(null)

  const { current: mutableState } = useRef<ColumnTransitionMutableState>({
    active: !transitionHandleRef,
    currentKey: transitionKey,
    pageHandlesByKey: new Map(),
  })

  const transitionActive = useCallback(
    (
      callback: (
        next: (
          controllerUpdate: ControllerUpdate<Record<string, any>, any>,
        ) => Promise<any>,
      ) => Promise<any>,
    ) => {
      const next = async (
        update: ControllerUpdate<Record<string, any>, any>,
      ) => {
        if (activeTransitionRef.current) {
          await activeTransitionRef.current.ctrl.start(update)
        }
      }
      return callback(next)
    },
    [],
  )

  const showTransition = useCallback(
    async (showKey: unknown, next: TransitionNext) => {
      const currentKey = mutableState.currentKey
      if (currentKey) {
        await mutableState.pageHandlesByKey.get(currentKey)?.leaving?.complete
      }
      mutableState.currentKey = showKey
      const pageHandle =
        showKey !== null ? mutableState.pageHandlesByKey.get(showKey) : null
      if (pageHandle?.transitionHandle) {
        await next({
          ...enterStyles,
          ...{ transform: 'none' },
          immediate: true,
        })
        await pageHandle?.transitionHandle.show()
      } else if (pageHandle) {
        await next({ ...fromStyles, immediate: true })
        await next(enterStyles)
        await next({
          ...enterStyles,
          ...{ transform: 'none' },
          immediate: true,
        })
      }
    },
    [mutableState, enterStyles, fromStyles],
  )

  const hideTransition = useCallback(
    async (hideKey: unknown, next: TransitionNext) => {
      const pageHandle = mutableState.pageHandlesByKey.get(hideKey)
      const leaveDeferred = new Deferred<void>()
      if (pageHandle && !pageHandle.leaving) {
        pageHandle.leaving = {
          complete: leaveDeferred.promise,
        }
      }
      if (pageHandle?.transitionHandle) {
        await pageHandle?.transitionHandle.hide()
        await next({ ...exitStyles, immediate: true })
      } else {
        await next({ ...enterStyles, immediate: true })
        await next(exitStyles)
      }
      await leaveDeferred.resolve()
    },
    [mutableState, exitStyles, enterStyles],
  )

  useEffect(() => {
    if (!mutableState.active) {
      mutableState.currentKey = transitionKey
    }
  }, [mutableState, transitionKey])

  useTransitionHandle(
    transitionHandleRef,
    {
      show: async () => {
        if (!mutableState.active) {
          mutableState.active = true
          return transitionActive((next) =>
            showTransition(mutableState.currentKey, next),
          )
        }
      },
      hide: async () => {
        if (mutableState.active) {
          mutableState.active = false
          return transitionActive((next) =>
            hideTransition(mutableState.currentKey, next),
          )
        }
      },
    },
    [mutableState, transitionActive, showTransition, hideTransition],
  )

  const hasHydrated = useHasHydrated()

  const transitions = useTransition(item, {
    key: (item: any) => item.key,
    initial: !mutableState.active ? fromStyles : initialStyles,
    from: fromStyles,
    enter: !mutableState.active
      ? fromStyles
      : ({ key }) =>
          async (next) => {
            if (hasHydrated) {
              await showTransition(key, next)
            }
          },
    leave: !mutableState.active
      ? fromStyles
      : ({ key }) =>
          async (next) => {
            await hideTransition(key, next)
          },
  })

  return (
    <div
      // Use a grid so that we're able to overlap any item that is
      // transitioning in over the previous item, and transparently compute
      // the sizes.
      css={css`
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: minmax(min-content, 1fr);
      `}
      {...rest}>
      {transitions((spring, item, t) => (
        <TransitionItem
          active={item.key === transitionKey}
          pageHandlesByKey={mutableState.pageHandlesByKey}
          spring={spring}
          transition={t}
          transitionRef={
            item.key === transitionKey ? activeTransitionRef : null
          }>
          {item.children}
        </TransitionItem>
      ))}
    </div>
  )
})

interface AppLayoutPageProps {
  active: boolean
  children: React.ReactNode
  pageHandlesByKey: PageHandlesByKey
  spring: Record<any, SpringValue<any>>
  transition: TransitionState<any, any>
  transitionRef: null | React.MutableRefObject<TransitionState<any, any> | null>
}

// This is a component class, as we need to use getSnapshotBeforeUpdate to
// fix some dimensions during transitions – and this lifecycle method has no
// hook-based alternative.
class TransitionItem extends React.Component<AppLayoutPageProps> {
  containerRef: React.RefObject<HTMLDivElement>
  key: unknown
  pageHandle?: PageHandle

  constructor(props: AppLayoutPageProps) {
    super(props)

    this.containerRef = React.createRef()
    this.key = this.props.transition.key
    this.pageHandle = {
      transitionKey: props.transition.key,
      transitionHandle: null,
    }
  }

  getSnapshotBeforeUpdate(): number | null {
    if (!this.props.active) {
      const container = this.containerRef.current
      if (container) {
        const { height } = container.getBoundingClientRect()
        return height
      }
    }
    return null
  }

  componentDidMount() {
    this.props.pageHandlesByKey.set(this.key, this.pageHandle!)

    if (this.props.active && this.props.transitionRef) {
      this.props.transitionRef.current = this.props.transition
    }
  }

  componentDidUpdate(
    prevProps: AppLayoutPageProps,
    _prevState: {},
    snapshot: number | null,
  ) {
    if (this.props.transitionRef) {
      this.props.transitionRef.current = this.props.transition
    } else if (
      prevProps.transitionRef &&
      prevProps.transitionRef.current === this.props.transition
    ) {
      prevProps.transitionRef.current = null
    }

    if (snapshot) {
      this.containerRef.current!.style.height = snapshot + 'px'
    }
  }

  componentWillUnmount() {
    if (this.props.transitionRef?.current === this.props.transition) {
      this.props.transitionRef.current = null
    }

    this.props.pageHandlesByKey.delete(this.key)
    delete this.pageHandle
  }

  transitionHandleRef = (transitionHandle: TransitionHandle | null) => {
    const pageHandle = this.pageHandle
    if (pageHandle) {
      pageHandle.transitionHandle = transitionHandle
    }
  }

  render() {
    const { active, children, spring } = this.props

    return (
      <overrideColumnTransitionHandleRefContext.Provider
        value={this.transitionHandleRef}>
        <div
          ref={this.containerRef}
          css={[
            css`
              grid-column: 1;
              grid-row: 1;

              display: flex;
              flex-direction: column;
              position: relative;
              width: 100%;
            `,
            !active &&
              css`
                overflow: hidden;
              `,
          ]}>
          <animated.div
            style={spring}
            css={[
              css`
                display: flex;
                flex-direction: column;
                flex-grow: 1;
              `,
            ]}>
            {children}
          </animated.div>
        </div>
      </overrideColumnTransitionHandleRefContext.Provider>
    )
  }
}