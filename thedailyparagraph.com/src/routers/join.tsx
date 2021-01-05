import * as React from 'react'
import { useState } from 'react'
import { Link } from 'retil-router'

import { useAuthController } from 'hooks/useFirebaseAuth'
import { AuthLayout } from 'components/authLayout'
import { Input } from 'components/input'

export default function Join() {
  const { createUserWithPassword } = useAuthController()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // - I want an operation hook, but I don't want to have to pass the
  //   operations to the hook -- I want it to return a function that
  //   I can call or something.

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createUserWithPassword({
      displayName,
      email,
      password,
    }).then(() => {
      console.log('created!')
    })
  }

  return (
    <AuthLayout title="Join in">
      <p>Every journey starts with a single step.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <br />
          <Input onChange={setDisplayName} value={displayName} />
        </label>
        <label>
          Email
          <br />
          <Input type="email" onChange={setEmail} value={email} />
        </label>
        <label>
          Password
          <br />
          <Input type="password" onChange={setPassword} value={password} />
        </label>
        <button type="submit">Join</button>
      </form>
      <hr />
      <Link to="/login">Sign In</Link>{' '}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
