import { css } from '@emotion/react'
import { rgba } from 'polished'
import {
  inActiveSurface,
  LinkSurface,
  PopupProvider,
  PopupTriggerSurface,
} from 'retil-interaction'
import { media, useMediaRenderer } from 'retil-media'
import { NavAction } from 'retil-nav'

import { OutlinedLabelledButtonBody } from '~/component/button/outlinedLabelledButtonBody'
import { Caret } from '~/component/caret'
import { FocusHoverIndicatorRing } from '~/component/indicator/focusHoverIndicatorRing'
import { Menu, MenuLinkItem } from '~/component/menu'
import { PopupDialogSurface } from '~/component/popup'
import { easeOut } from '~/style/easings'

export interface CustomerMenuProps {
  customerName: string
  scheme: {
    createStory: () => NavAction
    logout: () => NavAction
  }
}

export function CustomerMenu(props: CustomerMenuProps) {
  const { customerName, scheme } = props
  const renderWhenSmall = useMediaRenderer(media.small)
  const renderWhenAtLeastMedium = useMediaRenderer(media.atLeastMedium)

  return (
    <>
      <LinkSurface href={scheme.createStory()}>
        <OutlinedLabelledButtonBody label="Start a story" />
      </LinkSurface>
      <PopupProvider>
        <PopupTriggerSurface triggerOnPress>
          <FocusHoverIndicatorRing>
            {renderWhenAtLeastMedium((hideCSS) => (
              <div
                tabIndex={-1}
                css={(theme) => {
                  const primary = theme.color.primary
                  return [
                    css`
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

                      box-shadow: 0 0 0 1px ${primary} inset,
                        0 0 10px ${rgba(primary, 0.12)},
                        0 0 10px ${rgba(primary, 0.12)} inset;
                      color: ${primary};
                      text-shadow: 0 0 5px ${rgba(primary, 0.1)};

                      transition: opacity 200ms ${easeOut},
                        text-shadow 200ms ${easeOut},
                        box-shadow 200ms ${easeOut}, color 200ms ${easeOut};
                    `,
                    hideCSS,
                    inActiveSurface(css`
                      box-shadow: 0 0 0 1px ${primary} inset,
                        0 0 15px ${rgba(primary, 0.2)},
                        0 0 15px ${rgba(primary, 0.2)} inset;
                      text-shadow: 0 0 8px ${rgba(primary, 0.15)};
                    `),
                  ]
                }}>
                {/* {customer.avatarURL && (
                  <div
                    css={css`
                      position: relative;
                      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.03) inset;
                      background-color: white;
                      border-radius: 99px;
                      height: 24px;
                      width: 24px;
                      overflow: hidden;
                    `}>
                    {<img src={customer.avatarURL} width={30} height={30} />}
                  </div>
                )} */}
                <span
                  css={css`
                    margin: 0 0.5rem;
                  `}>
                  {customerName}
                </span>
                <Caret
                  css={css`
                    position: absolute;
                    right: 9px;
                  `}
                />
              </div>
            ))}
            {renderWhenSmall((hideCSS) => (
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
                  {/* <img src={customer.avatarURL!} width={28} height={28} /> */}
                </div>
                <Caret />
              </div>
            ))}
          </FocusHoverIndicatorRing>
        </PopupTriggerSurface>
        <PopupDialogSurface placement="bottom-end">
          <Menu>
            <MenuLinkItem href={scheme.logout()}>Log Out</MenuLinkItem>
          </Menu>
        </PopupDialogSurface>
      </PopupProvider>
    </>
  )
}
