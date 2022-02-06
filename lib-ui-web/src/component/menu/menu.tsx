import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useCallback, useContext } from 'react'
import {
  LinkSurface,
  LinkSurfaceProps,
  usePopupHandle,
} from 'retil-interaction'

const StyledMenu = styled.div`
  background-color: white;
  border: 1px solid #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.33rem 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`

const menuStyles = ({ color }: Theme) => css`
  color: ${color.onSurface};
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

export const MenuDivider = styled.hr(
  ({ theme: { color } }) => css`
    background-color: ${color.surfaceLine};
    border: none;
    display: flex;
    height: 1px;
    margin: 0.5rem 0;
    width: 100%;
  `,
)

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
      [disabled, onClick, onDidSelect],
    )

    return <div css={menuStyles} {...rest} ref={ref} onClick={handleClick} />
  },
)

export const MenuLinkItem = React.forwardRef<
  HTMLAnchorElement,
  LinkSurfaceProps
>(({ disabled, onClick, ...rest }, ref) => {
  const { onDidSelect } = useContext(MenuContext)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
    [disabled, onClick, onDidSelect],
  )

  return (
    <LinkSurface css={menuStyles} {...rest} ref={ref} onClick={handleClick} />
  )
})
