import { FormEvent } from 'react'
import { useState } from 'react'
import { LinkSurface } from 'retil-interaction'

import { useAuthController } from 'src/env/auth'
import { AuthLayout } from 'src/components/authLayout'
import { Input } from 'src/components/input'

export default function Page() {
  const { createUserWithPassword } = useAuthController()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createUserWithPassword({
      displayName,
      email,
      password,
    }).then(() => {
      console.log('created!')
    })
  }

  //
  // TODO:
  //
  // Explain that you can't login with
  // Google or Facebook, as we value your privacy.
  //

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
      <LinkSurface href="/login">Sign In</LinkSurface>
    </AuthLayout>
  )
}
