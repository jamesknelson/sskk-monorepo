import { css } from '@emotion/react'
import { useRef } from 'react'
import { Boundary } from 'retil-boundary'
import { useHasHydrated } from 'retil-hydration'
import { ButtonSurface } from 'retil-interaction'
import { useSource } from 'retil-source'
import { useEffectOnce } from 'retil-support'

import { createBackgroundScene } from 'src/components/background'
import {
  Editor,
  EditorHandle,
  EditorMenu,
  useEditorStateSource,
} from 'src/components/editor'
import appURLs from 'src/pages/appURLs'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { Card } from 'src/presentation/card'
import { structureColors } from 'src/presentation/colors'
import { barHeight } from 'src/presentation/dimensions'
import { LetterMetaBlock } from 'src/presentation/letterMetaBlock'
import { standardRadius } from 'src/presentation/radii'
import { TextBlock } from 'src/presentation/blocks'
import { createEditorState } from 'src/prose'

import { useJoinContext } from './joinContext'
import { useNavController } from 'retil-nav'
import { useAppEnv } from 'src/env'
import { Tooltip } from 'src/components/tooltip'

export const title = 'Say hello!'
export const meta = {
  robots: 'noindex',
}

export const backgroundScene = createBackgroundScene(async () => {
  const { default: Image } = await import(
    'src/assets/backgrounds/winter-cabin.optimized.svg?url'
  )

  return () => (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      `}>
      <img
        alt=""
        src={Image}
        css={css`
          position: absolute;
          bottom: 0;
          right: 0;
          opacity: 0.1;
          z-index: 0;
          transform: scale(1.5);
          transform-origin: bottom right;
        `}
      />
    </div>
  )
})

const minTextLength = 280

export function Page() {
  const hasHydrated = useHasHydrated()
  const appEnv = useAppEnv()
  const { navigate } = useNavController()
  const context = useJoinContext()
  const headerRef = useRef<HTMLDivElement>(null)

  useEffectOnce(() => {
    const header = headerRef.current!
    const observer = new IntersectionObserver(
      ([e]) => {
        e.target.classList.toggle('stuck', e.intersectionRatio < 1)
      },
      { threshold: [1] },
    )
    observer.observe(header)
    return () => {
      observer.unobserve(header)
    }
  })

  const [editorStateSource, editorStateHandle] = useEditorStateSource(
    () => {
      try {
        return createEditorState(
          context.persistence.get().introduction_letter_editor_state,
        )
      } catch {
        return createEditorState()
      }
    },
    (editorState) => {
      const textLength = editorState.doc.textContent.length
      context.persistence.save({
        introduction_letter_editor_state: textLength
          ? editorState.toJSON()
          : null,
      })
    },
  )

  const editorState = useSource(editorStateSource)
  const editorHandleRef = useRef<EditorHandle>(null)
  const currentTextLength = editorState.doc.textContent.length
  const pieProportion = hasHydrated
    ? Math.min(1, currentTextLength / minTextLength)
    : 0

  const handleRequestNext = () => {
    if (pieProportion < 1) {
      // TODO: show a tooltip saying you need x more characters
      return
    }

    navigate(
      appEnv.customer
        ? appURLs.join.chooseAddress()
        : appURLs.join.createAccount(),
    )
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 1rem 0.5rem;
      `}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          position: relative;
        `}>
        <div
          css={css`
            position: absolute;
            left: 0;
            right: 0;
            top: calc(${barHeight} - ${standardRadius});
            height: ${standardRadius};
            z-index: 2;

            background-color: ${structureColors.bg};
            border-left: 1px solid ${structureColors.border};
            border-right: 1px solid ${structureColors.border};
          `}
        />
        <div
          ref={headerRef}
          css={css`
            position: sticky;
            top: -1px;
            z-index: 2;
            margin-bottom: -1px;

            height: ${barHeight};
            display: flex;
            align-items: center;
            padding: 0 1.25rem;

            background-color: ${structureColors.wash};
            border: 1px solid ${structureColors.border};

            transition: border-radius 150ms ease-in-out;

            &:not(.stuck) {
              border-radius: ${standardRadius} ${standardRadius} 0 0;
            }
          `}>
          <EditorMenu
            state={editorState}
            applyTransaction={editorStateHandle.applyTransaction}
            editorHandleRef={editorHandleRef}
          />
        </div>
        <Card
          css={css`
            z-index: 1;
          `}>
          <div
            css={css`
              padding-bottom: 2rem;
            `}>
            <LetterMetaBlock
              title={null}
              from={[{ type: 'placeholder', label: 'You' }]}
              to={[
                {
                  type: 'member',
                  handle: 'jkn',
                  name: 'James K Nelson (at Letterhouse)',
                },
              ]}
            />
            <TextBlock>
              <Boundary fallback={<div />}>
                <Editor
                  state={editorState}
                  applyTransaction={editorStateHandle.applyTransaction}
                  autoFocus
                  minHeight="80px"
                  handleRef={editorHandleRef}
                />
              </Boundary>
            </TextBlock>
          </div>
        </Card>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        `}>
        <Tooltip
          disabled={pieProportion >= 1}
          label={`Your introduction needs another ${
            minTextLength - currentTextLength
          } characters`}
          placement="top"
          offset={[0, 8]}>
          <ButtonSurface
            disabled={pieProportion < 1}
            onTrigger={handleRequestNext}>
            <RaisedButtonBody
              inline
              label="Continue"
              rightGlyph={pieProportion >= 1 ? 'chevron' : pieProportion}
            />
          </ButtonSurface>
        </Tooltip>
      </div>
    </div>
  )
}
