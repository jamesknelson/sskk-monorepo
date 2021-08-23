import { BasicScroll, create as createBasicScroll } from 'basicscroll'
import { rgba } from 'polished'
import React, { useEffect, useRef } from 'react'
import { Boundary } from 'retil-boundary'
import {
  LinkSurface,
  PopupProvider,
  PopupTriggerSurface,
} from 'retil-interaction'
import { useMediaRenderer } from 'retil-media'
import styled, { css } from 'styled-components'

import { ButtonBody } from 'src/components/buttons'
import { Menu, MenuDivider, MenuItem, MenuLinkItem } from 'src/components/menu'
import { PopupDialog } from 'src/components/popup'
import { MemberProfile, useAppEnv, useAuthController } from 'src/env'
import {
  colors,
  dimensions,
  easings,
  focusRing,
  media,
  mediaSelectors,
  shadows,
} from 'src/theme'

export interface AppLayoutProps {
  children: React.ReactNode
}

const Caret = styled.div`
  width: 0;
  height: 0;
  border: 3px solid transparent;
  border-top-color: ${colors.ink.mid};
  margin-top: 3px;
`

export function AppLayout({ children }: AppLayoutProps) {
  const { layoutOptions = {}, profile } = useAppEnv()
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
        max-width: 100%;
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
        <LinkSurface
          href="/"
          css={css`
            color: ${colors.ink.black};
            font-family: 'chomskyregular', Arial, sans-serif;
            font-size: 1.5rem;
            text-decoration: none;
          `}>
          ¶
        </LinkSurface>
      </header>
      <nav
        css={css`
          position: fixed;
          top: 0;
          right: 0;
          height: ${dimensions.bar};
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          padding: 0 1.5rem 0 2rem;
          ${media.phoneOnly`
            padding: 0 1rem 0 1.5rem;
          `}
        `}>
        {profile !== undefined &&
          (profile ? (
            <UserMenu profile={profile} />
          ) : (
            <>
              <LinkSurface href="/login">
                <ButtonBody outline>Sign In</ButtonBody>
              </LinkSurface>
              {/* &nbsp;
                <Link to="/join">join</Link>{' '} */}
            </>
          ))}
      </nav>
      <main
        css={css`
          position: relative;
          flex-grow: 1;
          z-index: 0;
        `}>
        <Boundary fallback={<LoadingFallback />}>{children}</Boundary>
      </main>
      <footer
        css={css`
          text-align: center;
          margin: 2rem 2rem 0;
          padding-bottom: 2rem;
        `}>
        <LinkSurface
          css={css`
            color: ${colors.ink.mid};
            font-size: 90%;
            text-decoration: underline;
          `}
          href="/legal">
          Legal
        </LinkSurface>
      </footer>
    </div>
  )
}

interface UserMenuProps {
  profile: MemberProfile
}

function UserMenu(props: UserMenuProps) {
  const { profile } = props
  const { signOut } = useAuthController()
  const renderOnPhoneOnly = useMediaRenderer(mediaSelectors.phoneOnly)
  const renderOnTabletPlus = useMediaRenderer(mediaSelectors.tabletPlus)

  return (
    <>
      <LinkSurface href="/dashboard/stories/new">
        <ButtonBody outline>Start a story</ButtonBody>
      </LinkSurface>
      <PopupProvider>
        <PopupTriggerSurface triggerOnFocus triggerOnPress>
          {renderOnTabletPlus((hideCSS) => (
            <div
              tabIndex={-1}
              css={css`
                ${hideCSS}

                position: relative;
                display: flex;
                align-items: center;
                cursor: pointer;
                flex: 1;
                padding-right: 15px;
                padding-left: 5px;
                margin-left: 0.5rem;
                height: 2rem;
                font-size: 0.9rem;
                font-family: sans-serif;
                user-select: none;

                border-radius: 9999px;

                box-shadow: 0 0 0 1px ${colors.ink.black} inset,
                  0 0 10px ${rgba(colors.ink.black, 0.12)},
                  0 0 10px ${rgba(colors.ink.black, 0.12)} inset;
                color: ${colors.ink.black};
                text-shadow: 0 0 5px ${rgba(colors.ink.black, 0.1)};

                transition: opacity 200ms ${easings.easeOut},
                  text-shadow 200ms ${easings.easeOut},
                  box-shadow 200ms ${easings.easeOut},
                  color 200ms ${easings.easeOut};

                ${focusRing('::after', { radius: '9999px' })}

                :active {
                  box-shadow: 0 0 0 1px ${colors.ink.black} inset,
                    0 0 15px ${rgba(colors.ink.black, 0.2)},
                    0 0 15px ${rgba(colors.ink.black, 0.2)} inset;
                  text-shadow: 0 0 8px ${rgba(colors.ink.black, 0.15)};
                }
              `}>
              {profile.avatarURL && (
                <div
                  css={css`
                    position: relative;
                    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.03) inset;
                    /* background-color: #f6f8fa; */
                    background-color: white;
                    border-radius: 99px;
                    height: 24px;
                    width: 24px;
                    overflow: hidden;
                  `}>
                  {<img src={profile.avatarURL} width={30} height={30} />}
                </div>
              )}
              <span
                css={css`
                  margin: 0 0.5rem;
                `}>
                {profile.displayName}
              </span>
              <Caret
                css={css`
                  position: absolute;
                  right: 9px;
                `}
              />
            </div>
          ))}
          {renderOnPhoneOnly((hideCSS) => (
            <div
              css={css`
                ${hideCSS}

                position: relative;
                display: flex;
                align-items: center;
                margin-left: 0.5rem;
                overflow: hidden;
              `}>
              <div
                css={css`
                  position: relative;
                  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.03) inset;
                  background-color: white;
                  border-radius: 99px;
                  height: 28px;
                  width: 28px;
                  overflow: hidden;
                `}>
                <img src={profile.avatarURL!} width={28} height={28} />
              </div>
              <Caret
                css={css`
                  margin-left: 0.25rem;
                `}
              />
            </div>
          ))}
        </PopupTriggerSurface>
        <PopupDialog placement="bottom-end">
          <Menu>
            <MenuLinkItem to="/dashboard">Your Stories</MenuLinkItem>
            <MenuDivider />
            <MenuItem onClick={signOut}>Log Out</MenuItem>
          </Menu>
        </PopupDialog>
      </PopupProvider>
    </>
  )
}

function LoadingFallback() {
  return <div>Loading...</div>
}
