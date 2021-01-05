import * as React from 'react'
import { Link } from 'retil-router'

import { useAuthController } from 'src/utils/auth'
import { useAppRequest } from 'src/utils/routing'

export interface AppLayoutProps {
  children: React.ReactNode
}

export const LoadingUser = { loading: true }

export function AppLayout(props: AppLayoutProps) {
  const { children } = props
  const { currentUser } = useAppRequest()
  const { signOut } = useAuthController()

  console.log('currentUser', currentUser)

  return (
    <div>
      <header>
        <Link to="/">
          <strong>¶</strong>
        </Link>
        <nav>
          {currentUser !== undefined &&
            (currentUser && !currentUser.isAnonymous ? (
              <>
                <Link to="/settings">settings</Link> &nbsp;
                <button onClick={signOut}>logout</button>
              </>
            ) : (
              <>
                <Link to="/login">sign in</Link>
                {/* &nbsp;
                <Link to="/join">join</Link>{' '} */}
              </>
            ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <Link to="/legal">Legal</Link>
      </footer>
    </div>
  )
}
