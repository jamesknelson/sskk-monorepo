import { css } from '@emotion/react'
import { useEffect, useRef } from 'react'
import { getIssueMessage } from 'retil-issues'
import { useNavController } from 'retil-nav'

import { createBackgroundScene } from 'lib-ui-web/component/background'
import { TextBlock } from 'lib-ui-web/component/block/textBlock'
import { RaisedLabelledButtonBody } from 'lib-ui-web/component/button/raisedLabelledButtonBody'
import { Card } from 'lib-ui-web/component/card/card'
import { smallColumnClampWidth } from 'lib-ui-web/style/dimensions'

import appURLs from '~/app/appScheme'
import { useEnv } from '~/env'
import { useAuthController } from '~/env/auth'
import { validateCreateUserWithPasswordRequest } from '~/env/auth/authServiceIssues'
import { messages } from '~/locale/en'
import {
  createForm,
  FormSubmitButtonSurface,
  useForm,
  FormFieldBlock,
  FormInput,
} from '~/util/form'

import { useJoinContext } from './joinContext'

export const title = "You've taken the first step."
export const meta = {
  robots: 'noindex',
}

export const backgroundScene = createBackgroundScene(async () => {
  const { default: Image } = await import(
    'lib-ui-web/asset/background/steam-train.optimized.svg?url'
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
          max-width: ${smallColumnClampWidth};
          padding: 3rem 1.5rem 3rem;
        `}>
        <RegisterForm>
          <TextBlock
            css={css`
              text-align: center;
            `}>
            <h1>Thank you!</h1>

            <RegisterForm.IssuesConsumer>
              {(issues) => {
                const messages = issues
                  .filter((issue) => !issue.path)
                  .map((issue, i) => <div key={i}>{issue.message}</div>)
                return messages.length ? (
                  messages
                ) : (
                  <>
                    <p>
                      Writing that first letter takes some effort. Let's create
                      an account to keep it safe.
                    </p>
                  </>
                )
              }}
            </RegisterForm.IssuesConsumer>
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
              <RaisedLabelledButtonBody
                label={
                  status === 'complete'
                    ? 'Account created!'
                    : 'Create my account'
                }
                busyIndicator={
                  status === 'busy'
                    ? true
                    : status === 'complete'
                    ? 'above'
                    : 'below'
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
  const env = useEnv()
  const { createUserWithPassword } = useAuthController()
  const { navigate } = useNavController()
  const { persistence } = useJoinContext()

  const form = useForm({
    ...props,
    getMessage: (issue) =>
      getIssueMessage(issue, messages) || issue.message || issue.code,
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

  const customer = env.customerIdentity
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
