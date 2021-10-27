import { css } from '@emotion/react'
import { useEffect } from 'react'
import { LinkSurface } from 'retil-interaction'
import { useNavController } from 'retil-nav'

import { FormInput, FormFieldBlock } from 'src/components/form'
import { messages } from 'src/constants/messages'
import { useAuthController } from 'src/env/auth'
import { validateSignInWithPasswordRequest } from 'src/env/firebaseAuthIssues'
import appURLs from 'src/pages/appURLs'
import { TextBlock } from 'src/presentation/blocks'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { smallCardClampWidth } from 'src/presentation/dimensions'
import { Card } from 'src/presentation/card'
import { hideAuthBarEffect } from 'src/services/authBarService'
import { FormSubmitButtonSurface, createForm, useForm } from 'src/utils/form'

export function Page() {
  useEffect(hideAuthBarEffect, [])

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
        <LoginForm>
          <TextBlock
            css={css`
              text-align: center;
            `}>
            <h1>Welcome back</h1>

            <LoginForm.Issues>
              {(issues) => {
                const messages = issues
                  .filter((issue) => !issue.path)
                  .map((issue, i) => <div key={i}>{issue.message}</div>)
                return messages.length ? messages : null
              }}
            </LoginForm.Issues>
          </TextBlock>
          <LoginForm.FieldSurface path="email">
            <FormFieldBlock
              input={
                <FormInput
                  autoFocus
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
        {/* <Link to="/join">Create New Account</Link>{' '} */}
        <LinkSurface href="/recover">Recover Account</LinkSurface>
      </Card>
    </div>
  )
}

const LoginForm = createForm((props) => {
  const { signInWithPassword } = useAuthController()
  const { navigate } = useNavController()

  return useForm({
    ...props,
    getMessage: (issue) =>
      (issue.path && messages.auth[issue.path][issue.code]) ||
      issue.message ||
      issue.code,
    initialValue: {
      email: '',
      password: '',
    },
    onSubmit: async (form) => {
      if (await form.validate()) {
        form.clearIssues()
        const createUserIssues = await signInWithPassword(form.model.value)
        if (createUserIssues) {
          form.addIssues(createUserIssues)
        } else {
          // Navigation is handled by the loader.
          await navigate(appURLs.read.summary())
        }
      }
    },
    onValidate: validateSignInWithPasswordRequest,
  })
})
