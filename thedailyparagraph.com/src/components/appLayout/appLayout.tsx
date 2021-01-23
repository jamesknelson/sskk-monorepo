import { BasicScroll, create as createBasicScroll } from 'basicscroll'
import React, { useEffect, useRef } from 'react'
import { Link } from 'retil-router'
import { css } from 'styled-components'

import { Button, LinkButton } from 'src/components/button'
import { useAuthController } from 'src/utils/auth'
import { useAppRequest } from 'src/utils/routing'
import { colors, dimensions, easings, media, shadows } from 'src/theme'

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props
  const { layoutOptions = {}, profile } = useAppRequest()
  const { signOut } = useAuthController()

  const headerRef = useRef<HTMLDivElement>(null!)

  const scrollingHeader = layoutOptions.scrollingHeader

  useEffect(() => {
    let instance: BasicScroll

    if (scrollingHeader) {
      const instance = createBasicScroll({
        elem: headerRef.current,
        from: scrollingHeader.from,
        to: scrollingHeader.to,
        direct: headerRef.current,
        props: {
          '--header-background-opacity': {
            from: 0,
            to: 1,
          },
        },
        outside: () => {
          if (headerRef.current) {
            headerRef.current.classList.add('visible')
          }
        },
        inside: () => {
          if (headerRef.current) {
            headerRef.current.classList.remove('visible')
          }
        },
      })

      instance.update()
      instance.start()
    }

    return () => {
      if (instance) {
        instance.destroy()
      }
    }
  }, [scrollingHeader])

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding-top: ${dimensions.bar};
      `}>
      <header
        ref={headerRef}
        css={css`
          position: fixed;
          top: 0;
          width: 100%;
          left: 0;
          height: ${dimensions.bar};
          z-index: 1;

          background-color: ${colors.structure.bg};
          border-bottom: 1px solid ${colors.structure.border};
          box-shadow: ${shadows.card()};
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;

          padding: 0 1.5rem 0 2rem;
          ${media.phoneOnly`
          padding: 0 1rem 0 1.5rem;
          `}

          transition: transform 150ms ${easings.easeInOut};

          ${!!scrollingHeader &&
          media.tabletPlus`
            transform: translateY(-110%);

            &.visible {
              transform: translateY(0);
            }
          `}
        `}>
        <Link
          to="/"
          css={css`
            color: ${colors.ink.black};
            font-family: 'chomskyregular', Arial, sans-serif;
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
          position: relative;
          flex-grow: 1;
          z-index: 0;
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
