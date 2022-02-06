import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useRef } from 'react'
import { useHasHydrated } from 'retil-hydration'
import { LinkSurface } from 'retil-interaction'
import {
  ColumnTransition,
  useTransitionHandle,
  useTransitionHandleRef,
  useTransitionHandleRefContext,
} from 'retil-transition'

import {
  Background,
  createBackgroundScene,
} from 'lib-ui-web/component/background'
import { TextBlock } from 'lib-ui-web/component/block/textBlock'
import { RaisedLabelledButtonBody } from 'lib-ui-web/component/button/raisedLabelledButtonBody'
import { Card } from 'lib-ui-web/component/card'
import { barWidth, smallColumnClampWidth } from 'lib-ui-web/style/dimensions'
import { sansFontFamily } from 'lib-ui-web/style/fonts'

import appScheme from '~/app/appScheme'
import { useHideAuthBarEffect } from '~/service/authBarService'
import { FormInput, FormFieldBlock, FormSubmitButtonSurface } from '~/util/form'

import { LoginForm } from './loginForm'

export const backgroundScene = createBackgroundScene(async () => {
  const { default: Image } = await import(
    'lib-ui-web/asset/background/wind-turbines.optimized.svg'
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

export function Page() {
  const emailInputRef = useRef<HTMLInputElement>(null)

  const hasHydrated = useHasHydrated()
  const backgroundTransitionHandleRef = useTransitionHandleRef()
  const stepTransitionHandleRef = useTransitionHandleRef()

  const transitionRef = useTransitionHandleRefContext()

  useHideAuthBarEffect()
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
            max-width: ${smallColumnClampWidth};
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
              <RaisedLabelledButtonBody label="Log in" />
            </FormSubmitButtonSurface>
          </LoginForm>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              margin-top: 2rem;
            `}>
            <LinkSurface href={appScheme.recoverAccount()}>
              <LoginAltLinkBody>Recover Account</LoginAltLinkBody>
            </LinkSurface>
            <LinkSurface href={appScheme.join()}>
              <LoginAltLinkBody>Join</LoginAltLinkBody>
            </LinkSurface>
          </div>
        </Card>
      </ColumnTransition>
    </div>
  )
}

const LoginAltLinkBody = styled.span(
  ({ theme }) => css`
    color: ${theme.color.onSurface};
    opacity: ${theme.opacity.peripheral};
    font-family: ${sansFontFamily};
    text-decoration: underline;
  `,
)
