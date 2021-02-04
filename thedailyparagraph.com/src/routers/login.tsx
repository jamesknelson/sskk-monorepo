import React, { useState } from 'react'
import { Validator, useIssues, useValidator } from 'retil-issues'
import { Link, useNavigate } from 'retil-router'
import { useOperation } from 'retil-operation'
import { css } from 'styled-components'

import { AuthLayout } from 'src/components/authLayout'
import { Button } from 'src/components/button'
import { Input } from 'src/components/input'
import { colors } from 'src/theme'
import { useAuthController } from 'src/utils/auth'
import { useModel, useModelField } from 'src/utils/model'

interface LoginModelValue {
  email: string
  password: string
}

const validateLogin: Validator<LoginModelValue> = (value) => ({
  email: [!value.email && 'Please enter your email'],
  password: [!value.password && 'Please enter your password'],
})

export const router = () => <LoginPage />

export function LoginPage() {
  const [value, update] = useState({
    email: '',
    password: '',
  })
  const [issues, addIssues, clearIssues] = useIssues(value)
  const [validate] = useValidator(addIssues, validateLogin)
  const model = useModel({
    issues,
    value,
    update,
    validate,
  })

  const authController = useAuthController()
  const navigate = useNavigate()
  const [login, loginPending] = useOperation(async () => {
    if (await validate()) {
      clearIssues()
      const signInIssues = await authController.signInWithPassword(value)
      if (signInIssues) {
        addIssues(signInIssues)
      } else {
        await navigate('/dashboard')
      }
    }
  })

  const [emailInput, emailIssues] = useModelField(model, 'email')
  const [passwordInput, passwordIssues] = useModelField(model, 'password')

  return (
    <AuthLayout title="Sign in">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          login()
        }}
        css={css`
          margin: 1rem 0 2rem;

          label {
            display: block;
            margin-bottom: 1rem;
          }

          input {
            border: 1px solid ${colors.control.border.default};
            background-color: ${colors.control.bg.default};
            border-radius: 4px;
            padding: 0.5rem;
            display: block;
            width: 100%;
          }
        `}>
        <label>
          Email
          <Input type="email" {...emailInput} />
          {emailIssues[0]?.message}
        </label>
        <label>
          Password
          <Input type="password" {...passwordInput} />
          {passwordIssues[0]?.message}
        </label>
        <Button busy={loginPending} disabled={loginPending} type="submit">
          {loginPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      {/* <Link to="/join">Create New Account</Link>{' '} */}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
