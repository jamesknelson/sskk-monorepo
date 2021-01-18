import * as React from 'react'
import { useState } from 'react'
import { Validator, useIssues, useValidator } from 'retil-issues'
import {
  Link,
  useNavigate /*, useWaitUntilNavigationCompletes*/,
} from 'retil-router'
import { useOperation } from 'retil-operation'
import { css } from 'styled-components'

import { AuthLayout } from 'src/components/authLayout'
import { Button } from 'src/components/button'
import { Input } from 'src/components/input'
import { colors, shadows } from 'src/theme'
import { useAuthController } from 'src/utils/auth'

interface LoginData {
  email: string
  password: string
}

const validateLogin: Validator<LoginData> = (data) => ({
  email: [!data.email && 'Please enter your email'],
  password: [!data.password && 'Please enter your password'],
})

export const router = () => <LoginPage />

export function LoginPage() {
  const authController = useAuthController()
  const navigate = useNavigate()
  // const waitUntilNavigationCompletes = useWaitUntilNavigationCompletes()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const data = { email, password }
  const issues = useIssues<any, any, 'base', any>(data)
  const [validateAll, validatePath] = useValidator(issues, validateLogin)

  const [login, loginPending] = useOperation(async (event: React.FormEvent) => {
    event.preventDefault()

    const isValid = await validateAll()
    if (!isValid) {
      return
    }

    issues.clear()

    const signInIssues = await authController.signInWithPassword(data)
    if (signInIssues) {
      issues.add(signInIssues)
    } else {
      return navigate('/dashboard')
    }
  })

  return (
    <AuthLayout title="Sign in">
      <form
        onSubmit={login}
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
          <Input
            type="email"
            value={email}
            onBlur={() => validatePath('email')}
            onChange={setEmail}
          />
          {issues.on.email?.message}
        </label>
        <label>
          Password
          <Input
            type="password"
            value={password}
            onBlur={() => validatePath('password')}
            onChange={setPassword}
          />
          {issues.on.password?.message}
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
