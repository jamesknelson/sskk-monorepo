import React, { useContext } from 'react'
import { RouterAction, useLink } from 'retil-router'
import styled from 'styled-components'

import { PopupContext } from 'src/components/popup'
import { colors } from 'src/theme'

const StyledMenu = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.33rem 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`

const StyledMenuItem = styled.div`
  color: ${colors.text.secondary};
  cursor: pointer;
  display: block;
  font-size: 0.9rem;
  padding: 0.33rem 1rem;
  position: relative;
  text-align: left;
  text-decoration: none;
  width: 100%;
  white-space: nowrap;

  &:hover {
    background-color: #faf8f6;
  }
`

const MenuContext = React.createContext<{
  onDidSelect?: Function
}>({})

export interface MenuProps extends React.ComponentProps<'div'> {
  onDidSelect?: () => void
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ children, onDidSelect, ...rest }, ref) => {
    const popup = useContext(PopupContext)

    return (
      <MenuContext.Provider
        value={{
          onDidSelect:
            onDidSelect || (popup.trigger ? popup.trigger.close : undefined),
        }}>
        <StyledMenu {...rest} ref={ref}>
          {children}
        </StyledMenu>
      </MenuContext.Provider>
    )
  },
)

export const MenuDivider = styled.hr`
  background-color: ${colors.structure.divider};
  border: none;
  display: flex;
  height: 1px;
  margin: 0.5rem 0;
  width: 100%;
`

export const MenuText = styled.div`
  display: flex;
  font-size: ${(5 / 8) * 21}px;
  align-items: center;
  padding: 0;
`

export interface MenuItemProps extends React.ComponentProps<'div'> {
  onDidSelect?: Function
  disabled?: boolean
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ disabled, onDidSelect, onClick, ...rest }, ref) => {
    let context = useContext(MenuContext)

    if (!onDidSelect) {
      onDidSelect = context.onDidSelect
    }

    return (
      <StyledMenuItem
        {...rest}
        ref={ref}
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          if (onClick) {
            onClick(event)
          }
          if (!event.defaultPrevented && onDidSelect) {
            onDidSelect()
          }
        }}
      />
    )
  },
)

export interface MenuLinkItemProps
  extends Omit<React.ComponentProps<'a'>, 'hrfe'> {
  disabled?: boolean
  to: RouterAction
}

export const MenuLinkItem = ({
  to,
  onClick,
  onMouseEnter,
  ...rest
}: MenuLinkItemProps) => {
  const linkProps = useLink(to, {
    onClick,
    onMouseEnter,
  })
  //@ts-ignore
  return <MenuItem {...rest} {...linkProps} />
}
