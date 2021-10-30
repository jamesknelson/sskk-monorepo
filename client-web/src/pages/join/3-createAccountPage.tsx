import { css } from '@emotion/react'
import { useEffect, useRef } from 'react'
import { useNavController } from 'retil-nav'

// import { Check } from 'src/assets/glyphs'
import { createBackgroundScene } from 'src/components/background'
import { FormInput, FormFieldBlock } from 'src/components/form'
import { messages } from 'src/constants/messages'
import { useAppEnv } from 'src/env'
import { useAuthController } from 'src/env/auth'
import { validateCreateUserWithPasswordRequest } from 'src/env/firebaseAuthIssues'
import appURLs from 'src/pages/appURLs'
import { TextBlock } from 'src/presentation/blocks'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { Card } from 'src/presentation/card'
import { smallCardClampWidth } from 'src/presentation/dimensions'
import { FormSubmitButtonSurface, createForm, useForm } from 'src/utils/form'

import { useJoinContext } from './joinContext'

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
          right: 12%;
          opacity: 0.1;
          z-index: 0;
          transform: scale3d(-1.5, 1.5, 1.5);
          transform-origin: center bottom;
        `}
      />
    </div>
  )
})

export function Page() {
  return (
    <div
      css={css`
        padding: 0 1rem;
      `}>
      <Card
        css={css`
          margin: 2rem auto;
          max-width: ${smallCardClampWidth};
          padding: 3rem 1.5rem 3rem;
        `}>
        <RegisterForm>
          <TextBlock
            css={css`
              text-align: center;
            `}>
            <h1>It's that time.</h1>

            <RegisterForm.Issues>
              {(issues) => {
                const messages = issues
                  .filter((issue) => !issue.path)
                  .map((issue, i) => <div key={i}>{issue.message}</div>)
                return messages.length ? (
                  messages
                ) : (
                  <p>
                    You'll need to create a Letterhouse login to send your
                    letter.
                  </p>
                )
              }}
            </RegisterForm.Issues>
          </TextBlock>
          <RegisterForm.FieldSurface path="displayName">
            <FormFieldBlock
              label="Name"
              input={<FormInput autoFocus placeholder="Little Red" />}
            />
          </RegisterForm.FieldSurface>
          <RegisterForm.FieldSurface path="email">
            <FormFieldBlock
              input={<FormInput type="email" placeholder="hood@example.com" />}
            />
          </RegisterForm.FieldSurface>
          <RegisterForm.FieldSurface path="password">
            <FormFieldBlock input={<FormInput type="password" />} />
          </RegisterForm.FieldSurface>
          <FormSubmitButtonSurface
            css={css`
              background-color: transparent;
              display: block;
              width: 100%;
            `}>
            {(status) => (
              <RaisedButtonBody
                label={
                  status === 'complete'
                    ? 'Account created!'
                    : 'Create my account'
                }
                busyIndicatorPlacement={
                  status === 'complete' ? 'above' : 'below'
                }
              />
            )}
          </FormSubmitButtonSurface>
        </RegisterForm>
      </Card>
    </div>
  )
}

const RegisterForm = createForm((props) => {
  const env = useAppEnv()
  const { createUserWithPassword } = useAuthController()
  const { navigate } = useNavController()
  const { persistence } = useJoinContext()

  const form = useForm({
    ...props,
    getMessage: (issue) =>
      (issue.path && messages.auth[issue.path][issue.code]) ||
      issue.message ||
      issue.code,
    initialValue: {
      displayName: '',
      email: '',
      password: '',
    },
    onSubmit: async (form) => {
      if (await form.validate()) {
        form.clearIssues()
        const createUserIssues = await createUserWithPassword(form.model.value)
        if (createUserIssues) {
          form.addIssues(createUserIssues)
        }
      }
    },
    onValidate: validateCreateUserWithPasswordRequest,
  })

  const customer = env.customer
  const { current: initiallyPersistedData } = useRef(persistence.get())

  // This will only be called after account creation, as the router prevents
  // guests from loading this page while already logged in.
  useEffect(() => {
    if (customer) {
      // Re-save the current data to persist on the server, now that we
      // have a customer id.
      persistence.save(
        {
          ...initiallyPersistedData,
          persona_name: customer.contact_name,
        },
        { immediate: true },
      )

      // Continue on to the next page
      navigate(appURLs.join.chooseAddress())
    }
  }, [customer, initiallyPersistedData, navigate, persistence])

  return form
})
