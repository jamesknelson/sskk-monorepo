import { BasicScroll, create as createBasicScroll } from 'basicscroll'
import Image from 'next/image'
import { rgba } from 'polished'
import React, { useEffect, useRef } from 'react'
import { Link } from 'retil-router'
import styled, { css } from 'styled-components'

import { LinkButton } from 'src/components/button'
import { Menu, MenuDivider, MenuItem, MenuLinkItem } from 'src/components/menu'
import { PopupProvider, PopupTrigger, Popup } from 'src/components/popup'
import { PhoneOnly, TabletPlus } from 'src/components/responsive'
import { useAuthController } from 'src/utils/auth'
import { MemberProfile } from 'src/utils/memberProfile'
import { useAppRequest } from 'src/utils/routing'
import {
  colors,
  dimensions,
  easings,
  focusRing,
  media,
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
  const { layoutOptions = {}, profile } = useAppRequest()
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
            align-items: stretch;
            position: relative;
          `}>
          {profile !== undefined &&
            (profile ? (
              <UserMenu profile={profile} />
            ) : (
              <>
                <LinkButton outline to="/login">
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

interface UserMenuProps {
  profile: MemberProfile
}

function UserMenu(props: UserMenuProps) {
  const { profile } = props
  const { signOut } = useAuthController()

  return (
    <>
      <LinkButton outline to="/dashboard/stories/new">
        Start a story
      </LinkButton>
      <PopupProvider triggerOnFocus triggerOnSelect>
        <PopupTrigger>
          {(triggerRef) => (
            <>
              <TabletPlus>
                <div
                  ref={triggerRef}
                  tabIndex={-1}
                  css={css`
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
                      {<Image src={profile.avatarURL} width={30} height={30} />}
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
              </TabletPlus>
              <PhoneOnly>
                <div
                  ref={triggerRef}
                  css={css`
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
                    <Image src={profile.avatarURL!} width={28} height={28} />
                  </div>
                  <Caret
                    css={css`
                      margin-left: 0.25rem;
                    `}
                  />
                </div>
              </PhoneOnly>
            </>
          )}
        </PopupTrigger>
        <Popup placement="bottom-end">
          <Menu>
            <MenuLinkItem to="/dashboard">Your Stories</MenuLinkItem>
            <MenuDivider />
            <MenuItem onClick={signOut}>Log Out</MenuItem>
          </Menu>
        </Popup>
      </PopupProvider>
    </>
  )
}
