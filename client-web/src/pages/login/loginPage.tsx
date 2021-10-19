import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { LinkSurface, SubmitButtonSurface } from 'retil-interaction'
import { Validator, useIssues, useValidator } from 'retil-issues'
import { useNavController } from 'retil-nav'
import { useOperation } from 'retil-operation'

import { AuthLayout } from 'src/components/authLayout'
import { Input } from 'src/components/input'
import { useAuthController } from 'src/env/auth'
import appURLs from 'src/pages/appURLs'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'
import { controlColors } from 'src/presentation/colors'
import { hideAuthBarEffect } from 'src/services/authBarService'
// import { useModel, useModelField } from 'src/utils/model'

interface LoginModelValue {
  email: string
  password: string
}

const validateLogin: Validator<LoginModelValue> = (value) => ({
  email: [!value.email && 'Please enter your email'],
  password: [!value.password && 'Please enter your password'],
})

export function Page() {
  useEffect(hideAuthBarEffect, [])

  const [value, update] = useState({
    email: '',
    password: '',
  })
  const [issues, addIssues, clearIssues] = useIssues(value)
  const [validate] = useValidator(addIssues, validateLogin)

  return null

  // const model = useModel({
  //   issues,
  //   value,
  //   update,
  //   validate,
  // })

  // const authController = useAuthController()
  // const { navigate } = useNavController()
  // const [login, loginPending] = useOperation(async () => {
  //   if (await validate()) {
  //     clearIssues()
  //     const signInIssues = await authController.signInWithPassword(value)
  //     if (signInIssues) {
  //       addIssues(signInIssues)
  //     } else {
  //       await navigate(appURLs.read.summary())
  //     }
  //   }
  // })

  // const [emailInput, emailIssues] = useModelField(model, 'email')
  // const [passwordInput, passwordIssues] = useModelField(model, 'password')

  // return (
  //   <AuthLayout title="Sign in">
  //     <form
  //       onSubmit={(event) => {
  //         event.preventDefault()
  //         login()
  //       }}
  //       css={css`
  //         margin: 1rem 0 2rem;

  //         label {
  //           display: block;
  //           margin-bottom: 1rem;
  //         }

  //         input {
  //           border: 1px solid ${controlColors.border.default};
  //           background-color: ${controlColors.bg.default};
  //           border-radius: 4px;
  //           padding: 0.5rem;
  //           display: block;
  //           width: 100%;
  //         }
  //       `}>
  //       <label>
  //         Email
  //         <Input type="email" {...emailInput} />
  //         {emailIssues[0]?.message}
  //       </label>
  //       <label>
  //         Password
  //         <Input type="password" {...passwordInput} />
  //         {passwordIssues[0]?.message}
  //       </label>
  //       <SubmitButtonSurface disabled={loginPending}>
  //         <RaisedButtonBody
  //           label={loginPending ? 'Signing in...' : 'Sign in'}
  //           showBusyIndicator={loginPending}
  //         />
  //       </SubmitButtonSurface>
  //     </form>
  //     {/* <Link to="/join">Create New Account</Link>{' '} */}
  //     <LinkSurface href="/recover">Recover Account</LinkSurface>
  //   </AuthLayout>
  // )
}
