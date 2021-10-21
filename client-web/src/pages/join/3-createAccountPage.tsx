import { css } from '@emotion/react'
import { SubmitButtonSurface } from 'retil-interaction'
import { useNavController } from 'retil-nav'

import { createBackgroundScene } from 'src/components/background'
import { FormInput, FormFieldBlock } from 'src/components/form'
import { messages } from 'src/constants/messages'
import { useAuthController } from 'src/env/auth'
import { validateCreateUserWithPasswordRequest } from 'src/env/firebaseAuthIssues'
import appURLs from 'src/pages/appURLs'
import { TextBlock } from 'src/presentation/blocks'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { Card } from 'src/presentation/card'
import { smallCardClampWidth } from 'src/presentation/dimensions'
import { createForm } from 'src/utils/form'

const RegisterForm = createForm({
  getMessage: (issue) =>
    (issue.path && messages.auth[issue.path][issue.code]) ||
    issue.message ||
    issue.code,
  onValidate: validateCreateUserWithPasswordRequest,
})

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
          <RegisterForm
            initialValue={{
              displayName: '',
              email: '',
              password: '',
            }}
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
            <RegisterForm.FieldSurface path="displayName">
              <FormFieldBlock
                label="Name"
                input={<FormInput autoFocus placeholder="Little Red" />}
              />
            </RegisterForm.FieldSurface>
            <RegisterForm.FieldSurface path="email">
              <FormFieldBlock
                input={
                  <FormInput type="email" placeholder="hood@example.com" />
                }
              />
            </RegisterForm.FieldSurface>
            <RegisterForm.FieldSurface path="password">
              <FormFieldBlock input={<FormInput type="password" />} />
            </RegisterForm.FieldSurface>
            <SubmitButtonSurface
              css={css`
                width: 100%;
                background-color: transparent;
                text-align: center;
              `}>
              <RaisedButtonBody label="Create my account" />
            </SubmitButtonSurface>
          </RegisterForm>
          <hr />
        </Card>
      </div>
    </div>
  )
}
