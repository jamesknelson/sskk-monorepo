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
import { Card } from 'src/presentation/card'
import { textColors } from 'src/presentation/colors'
import { smallCardClampWidth } from 'src/presentation/dimensions'
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
            text-align: center;
          `}>
          <TextBlock>
            <h1>It's that time.</h1>
            <p>You'll need a Letterhouse login to send your letter.</p>
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
                  <Field>
                    <Input />
                  </Field>
                </Provide>
                <Provide path="email">
                  <Field>
                    <Input type="email" />
                  </Field>
                </Provide>
                <Provide path="password">
                  <Field>
                    <Input type="password" />
                  </Field>
                </Provide>

                <SubmitButtonSurface>Register</SubmitButtonSurface>
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

const Field = (props: FieldProps) => {
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
        margin: 1rem 0;
      `}>
      <label
        css={css`
          color: ${textColors.default};
          display: block;
          font-weight: 600;
          font-size: 90%;
          line-height: 2rem;
          text-transform: uppercase;
          width: 100%;
        `}>
        {label}
        {children}
      </label>
      <div
        css={css`
          color: ${textColors.default};
          font-size: 90%;
          line-height: 1.4rem;
          margin: 0.5rem 0;
        `}>
        {message}
      </div>
    </div>
  )
}

function Input(props: JSX.IntrinsicElements['input']) {
  const [{ onChange, ...inputProps }] = useModelInput({
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

  return <input {...inputProps} {...props} onChange={handleChange} />
}
