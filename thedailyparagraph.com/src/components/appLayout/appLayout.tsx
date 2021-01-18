import * as React from 'react'
import { Link } from 'retil-router'
import { css } from 'styled-components'

import { Button, LinkButton } from 'src/components/button'
import { useAuthController } from 'src/utils/auth'
import { useAppRequest } from 'src/utils/routing'
import { colors, dimensions, shadows } from 'src/theme'

export interface AppLayoutProps {
  children: React.ReactNode
}

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
          flex-basis: ${dimensions.bar};
          flex-shrink: 0;
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
        <nav
          css={css`
            display: flex;
            align-items: center;
          `}>
          {profile !== undefined &&
            (profile ? (
              <>
                <Link
                  to="/dashboard"
                  css={css`
                    color: ${colors.ink.black};
                    margin-right: 1rem;
                  `}>
                  {profile.displayName}
                </Link>
                {/* &nbsp;&middot;&nbsp;
                <Link to="/settings">Account settings</Link>&nbsp; */}
                <Button outline tabIndex={-1} onClick={signOut}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <LinkButton outline tabIndex={-1} to="/login">
                  Sign In
                </LinkButton>
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
          margin: 2rem 2rem 0;
          padding-bottom: 2rem;
        `}>
        <Link
          css={css`
            color: ${colors.ink.mid};
            font-size: 90%;
            text-decoration: underline;
          `}
          to="/legal">
          Legal
        </Link>
      </footer>
    </div>
  )
}
