import * as React from 'react'
import { Link } from 'retil-router'
import { css } from 'styled-components'

import { useAuthController } from 'src/utils/auth'
import { useAppRequest } from 'src/utils/routing'
import { colors, dimensions, shadows } from 'src/theme'

export interface AppLayoutProps {
  children: React.ReactNode
}

export const LoadingUser = { loading: true }

export function AppLayout(props: AppLayoutProps) {
  const { children } = props
  const { profile } = useAppRequest()
  const { signOut } = useAuthController()

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}>
      <header
        css={css`
          background-color: ${colors.structure.bg};
          border-bottom: 1px solid ${colors.structure.border};
          box-shadow: ${shadows.card()};
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: ${dimensions.bar};
          padding: 0 2rem;
          width: 100%;
        `}>
        <Link
          to="/"
          css={css`
            color: ${colors.ink.black};
            font-family: 'Arial';
            font-size: 1.5rem;
            text-decoration: none;
          `}>
          ¶
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
      <main
        css={css`
          flex-grow: 1;
        `}>
        {children}
      </main>
      <footer
        css={css`
          text-align: center;
          margin: 2rem;
        `}>
        <Link
          css={css`
            color: ${colors.ink.mid};
            font-size: 90%;
          `}
          to="/legal">
          Legal
        </Link>
      </footer>
    </div>
  )
}
