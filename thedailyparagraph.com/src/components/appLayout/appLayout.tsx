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
  const { profile } = useAppRequest()
  const { signOut } = useAuthController()

  return (
    <div>
      <header>
        <Link to="/">
          <strong>¶</strong>
        </Link>
        <nav>
          {profile !== undefined &&
            (profile ? (
              <>
                <Link to="/dashboard">{profile.displayName}</Link>
                &nbsp;&middot;&nbsp;
                <Link to="/settings">Account settings</Link>&nbsp;
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
      <hr />
      <main>{children}</main>
      <hr />
      <footer>
        <Link to="/legal">Legal</Link>
      </footer>
    </div>
  )
}
