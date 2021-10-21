import { css } from '@emotion/react'
import { useCallback } from 'react'
import { SubmitButtonSurface } from 'retil-interaction'
import { useNavController } from 'retil-nav'

import { createBackgroundScene } from 'src/components/background'
import { messages } from 'src/constants/messages'
import { useAuthController } from 'src/env/auth'
import { validateCreateUserWithPasswordRequest } from 'src/env/firebaseAuthIssues'
import appURLs from 'src/pages/appURLs'
import { TextBlock } from 'src/presentation/blocks'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { Card } from 'src/presentation/card'
import {
  controlColors,
  structureColors,
  textColors,
} from 'src/presentation/colors'
import { smallCardClampWidth } from 'src/presentation/dimensions'
import { easeOut } from 'src/presentation/easings'
import { standardRadius } from 'src/presentation/radii'
import { Form, useModelInput } from 'src/utils/model'

export const title = "You've taken the first step."
export const meta = {
  robots: 'noindex',
}

export const backgroundScene = createBackgroundScene(async () => {
  const { default: Image } = await import(
    'src/assets/backgrounds/steam-train.optimized.svg'
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
          transform: scale(1.5);
          transform-origin: bottom right;
        `}
      />
    </div>
  )
})

export function Page() {
  const { createUserWithPassword } = useAuthController()
  const { navigate } = useNavController()

  return (
    <div
      css={css`
        padding: 0 1rem;
        margin-top: 2rem;
      `}>
      <div
        css={css`
          margin: 0 auto 2rem;
          max-width: ${smallCardClampWidth};
        `}>
        <Card
          css={css`
            padding: 3rem 1.5rem 3rem;
          `}>
          <TextBlock
            css={css`
              text-align: center;
            `}>
            <h1>It's that time.</h1>
            <p>
              You'll need to create a Letterhouse login to send your letter.
            </p>
          </TextBlock>
          <Form
            initialValue={{
              displayName: '',
              email: '',
              password: '',
            }}
            getMessage={useCallback(
              (issue) =>
                (issue.path && messages.auth[issue.path][issue.code]) ||
                issue.message ||
                issue.code,
              [],
            )}
            onValidate={validateCreateUserWithPasswordRequest}
            onSubmit={async (form) => {
              if (await form.validate()) {
                form.clearIssues()
                const createUserIssues = await createUserWithPassword(
                  form.model.value,
                )
                if (createUserIssues) {
                  form.addIssues(createUserIssues)
                } else {
                  // Navigation is handled by the loader.
                  await navigate(appURLs.join.selectMembershipType())
                }
              }
            }}>
            {(Provide) => (
              <>
                <Provide path="displayName">
                  <FieldBlock label="Name">
                    <Input placeholder="Little Red" />
                  </FieldBlock>
                </Provide>
                <Provide path="email">
                  <FieldBlock>
                    <Input type="email" placeholder="hood@example.com" />
                  </FieldBlock>
                </Provide>
                <Provide path="password">
                  <FieldBlock>
                    <Input type="password" />
                  </FieldBlock>
                </Provide>

                <SubmitButtonSurface
                  css={css`
                    width: 100%;
                    background-color: transparent;
                    text-align: center;
                  `}>
                  <RaisedButtonBody label="Create my account" />
                </SubmitButtonSurface>
              </>
            )}
          </Form>
          <hr />
        </Card>
      </div>
    </div>
  )
}

interface FieldProps extends React.ComponentProps<'div'> {
  children: React.ReactNode
  hint?: React.ReactNode
  message?: React.ReactNode
  label?: React.ReactNode
}

const FieldBlock = (props: FieldProps) => {
  const [{ name }, issues] = useModelInput()
  const firstIssueMessage = issues[0]?.message
  const {
    children,
    hint,
    label = name,
    message = firstIssueMessage || hint,
    ...rest
  } = props

  return (
    <div
      {...rest}
      css={css`
        margin: 1.5rem 0;
      `}>
      <label
        css={css`
          color: ${textColors.tertiary};
          display: block;
          font-family: sans-serif;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-transform: uppercase;
          width: 100%;
        `}>
        <div
          css={css`
            display: block;
            padding: 0 0.5rem;
          `}>
          {label}
        </div>
        <div
          css={css`
            display: flex;
            justify-content: center;
            padding: 0.25rem 0;
            border-bottom: 1px solid ${controlColors.border.default};
          `}>
          {children}
        </div>
      </label>
      <div
        css={css`
          background-color: ${structureColors.canvas};
          border-radius: 0 0 ${standardRadius} ${standardRadius};
          padding: 0 0.5rem;
          color: ${textColors.tertiary};
          font-family: sans-serif;
          font-size: 0.75rem;
          line-height: 1.5rem;
        `}>
        {message}
      </div>
    </div>
  )
}

function Input(props: JSX.IntrinsicElements['input']) {
  const [{ onChange, ...inputProps }, issues] = useModelInput({
    onChange: props.onChange,
  })

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    },
    [onChange],
  )

  return (
    <input
      css={css`
        border-radius: ${standardRadius};
        color: ${textColors.default};
        flex-grow: 1;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 100%;
        width: 100%;
        padding: 0.25rem 0.5rem;

        ::placeholder {
          color: ${issues.length ? textColors.placeholder : 'transparent'};
          transition: color 500ms ${easeOut};
        }
      `}
      {...inputProps}
      {...props}
      onChange={handleChange}
    />
  )
}
