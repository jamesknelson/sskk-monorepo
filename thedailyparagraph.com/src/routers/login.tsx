import * as React from 'react'
import { useState } from 'react'
import { Validator, useIssues, useValidator } from 'retil-issues'
import {
  Link,
  useNavigate /*, useWaitUntilNavigationCompletes*/,
} from 'retil-router'
import { useOperation } from 'retil-operation'

import { AuthLayout } from 'src/components/authLayout'
import { Input } from 'src/components/input'
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
  const issues = useIssues(data)
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
      <form onSubmit={login}>
        <label>
          Email
          <br />
          <Input
            type="email"
            value={email}
            onBlur={() => validatePath('email')}
            onChange={setEmail}
          />
          <br />
          {issues.on.email?.message}
        </label>
        <label>
          Password
          <br />
          <Input
            type="password"
            value={password}
            onBlur={() => validatePath('password')}
            onChange={setPassword}
          />
          <br />
          {issues.on.password?.message}
        </label>
        <button disabled={loginPending} type="submit">
          {loginPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <hr />
      {/* <Link to="/join">Create New Account</Link>{' '} */}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
