import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import { useHasHydrated } from 'retil-hydration'
import { LinkSurface } from 'retil-interaction'

import { Background, createBackgroundScene } from 'src/components/background'
import { FormInput, FormFieldBlock } from 'src/components/form'
import {
  ColumnTransition,
  useOverrideColumnTransitionHandleRef,
} from 'src/components/columnTransition'
import { TextBlock } from 'src/components/block'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { Card } from 'src/presentation/card'
import { hideAuthBarEffect } from 'src/services/authBarService'
import { FormSubmitButtonSurface } from 'src/utils/form'
import { barWidth, smallCardClampWidth } from 'src/theme/dimensions'
import { sansFontFamily } from 'src/theme/fonts'
import { paletteColors } from 'src/theme/colors'
import {
  useTransitionHandle,
  useTransitionHandleRef,
} from 'src/utils/transitionHandle'

import { LoginForm } from './loginForm'

export const backgroundScene = createBackgroundScene(async () => {
  const { default: Image } = await import(
    'src/assets/backgrounds/wind-turbines.optimized.svg'
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
      <Image
        css={css`
          position: absolute;
          bottom: 0;
          right: 0;
          opacity: 0.1;
          z-index: 0;
          transform: scale(1.2);
          transform-origin: bottom right;
        `}
      />
    </div>
  )
})

export const [useDeps, loadDeps] = deps((theme) => ({
  ...pick(theme.glyphs, ['X', 'Y']),
  Joe: import('./y'),
}))

export function Page() {
  const deps = useDeps()
  const emailInputRef = useRef<HTMLInputElement>(null)

  const hasHydrated = useHasHydrated()
  const backgroundTransitionHandleRef = useTransitionHandleRef()
  const stepTransitionHandleRef = useTransitionHandleRef()

  const transitionRef = useOverrideColumnTransitionHandleRef()

  useEffect(hideAuthBarEffect, [])
  useTransitionHandle(
    hasHydrated ? transitionRef : null,
    {
      show: async () => {
        await stepTransitionHandleRef.current?.show()
        if (emailInputRef.current) {
          emailInputRef.current.focus()
        }
        return await backgroundTransitionHandleRef.current?.show()
      },
      hide: async () => {
        const fadeBackgroundOut = backgroundTransitionHandleRef.current?.hide()
        stepTransitionHandleRef.current?.hide()
        return await fadeBackgroundOut
      },
    },
    [],
  )

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1rem;
        flex-grow: 1;
      `}>
      <Background
        css={css`
          position: fixed;
          top: 0;
          left: ${barWidth};
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        `}
        scene={backgroundScene}
        transitionHandleRef={hasHydrated ? backgroundTransitionHandleRef : null}
      />
      <ColumnTransition
        css={css`
          flex-grow: 1;
          z-index: 1;
        `}
        transitionKey="login"
        transitionHandleRef={hasHydrated ? stepTransitionHandleRef : null}>
        <Card
          css={css`
            margin: 2rem auto;
            max-width: ${smallCardClampWidth};
            padding: 3rem 1.5rem 2rem;
          `}>
          <LoginForm>
            <TextBlock
              css={css`
                text-align: center;
                margin-bottom: 3rem;
              `}>
              <h1>Welcome back</h1>

              <LoginForm.IssuesConsumer>
                {(issues) => {
                  const messages = issues
                    .filter((issue) => !issue.path)
                    .map((issue, i) => <div key={i}>{issue.message}</div>)
                  return messages.length ? messages : <p>We've missed you.</p>
                }}
              </LoginForm.IssuesConsumer>
            </TextBlock>
            <LoginForm.FieldSurface path="email">
              <FormFieldBlock
                input={
                  <FormInput
                    autoFocus={!hasHydrated}
                    ref={emailInputRef}
                    type="email"
                    placeholder="hood@example.com"
                  />
                }
              />
            </LoginForm.FieldSurface>
            <LoginForm.FieldSurface path="password">
              <FormFieldBlock input={<FormInput type="password" />} />
            </LoginForm.FieldSurface>
            <FormSubmitButtonSurface
              css={css`
                background-color: transparent;
                display: block;
                width: 100%;
              `}>
              <RaisedButtonBody label="Log in" />
            </FormSubmitButtonSurface>
          </LoginForm>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              margin-top: 2rem;
            `}>
            <LinkSurface href="/recover">
              <LoginAltLinkBody>Recover Account</LoginAltLinkBody>
            </LinkSurface>
            <LinkSurface href="/join">
              <LoginAltLinkBody>Join</LoginAltLinkBody>
            </LinkSurface>
          </div>
        </Card>
      </ColumnTransition>
    </div>
  )
}

const LoginAltLinkBody = styled.span`
  color: ${paletteColors.ink500};
  font-family: ${sansFontFamily};
  text-decoration: underline;
`
