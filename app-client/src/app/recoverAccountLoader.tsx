import { LinkSurface } from 'retil-interaction'

import { LoadingPage } from '~/app/loadingPage'
import { loadWhenUnauthenticated } from '~/util/routing'

export function RecoverAccountPage() {
  return (
    <>
      <h1>Recover account</h1>
      <form>
        <label>
          Your email
          <input type="email" value="" />
        </label>
      </form>
      <hr />
      {/* <Link to="/join">Create New Account</Link>{' '} */}
      <LinkSurface href="/login">Sign In</LinkSurface>
    </>
  )
}

const loader = loadWhenUnauthenticated(
  () => <RecoverAccountPage />,
  '/dashboard',
  () => <LoadingPage />,
)

export default loader
