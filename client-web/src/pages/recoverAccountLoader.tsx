import * as React from 'react'
import { LinkSurface } from 'retil-interaction'

import { AuthLayout } from 'src/components/authLayout'

import { loadWhenUnauthenticated } from 'src/env/routing'

export function RecoverAccountPage() {
  return (
    <AuthLayout title="Recover Account">
      <form>
        <label>
          Your email
          <input type="email" value="" />
        </label>
      </form>
      <hr />
      {/* <Link to="/join">Create New Account</Link>{' '} */}
      <LinkSurface href="/login">Sign In</LinkSurface>
    </AuthLayout>
  )
}

const loader = loadWhenUnauthenticated(
  () => <RecoverAccountPage />,
  '/dashboard',
)

export default loader
