import React, { useCallback, useContext } from 'react'
import { usePopupHandle } from 'retil-interaction'
import { NavAction, useNavLinkProps } from 'retil-nav'
import styled from 'styled-components'

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
    const handle = usePopupHandle()

    return (
      <MenuContext.Provider
        value={{
          onDidSelect: onDidSelect || handle?.close,
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
    const context = useContext(MenuContext)

    if (!onDidSelect) {
      onDidSelect = context.onDidSelect
    }

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
      },
      [onClick, onDidSelect],
    )

    return <StyledMenuItem {...rest} ref={ref} onClick={handleClick} />
  },
)

export interface MenuLinkItemProps
  extends Omit<React.ComponentProps<'a'>, 'href'> {
  disabled?: boolean
  to: NavAction
}

export const MenuLinkItem = React.forwardRef<
  HTMLAnchorElement,
  MenuLinkItemProps
>(({ disabled, to, onClick, onMouseEnter, ...rest }, ref) => {
  const { onDidSelect } = useContext(MenuContext)
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
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
    },
    [onClick, onDidSelect],
  )

  const linkProps = useNavLinkProps(to, {
    onClick: handleClick,
    onMouseEnter,
  })

  return <StyledMenuItem as="a" {...rest} {...linkProps} ref={ref} />
})
