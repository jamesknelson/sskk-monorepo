import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  AnchorSurface,
  MatchedLinkSurface,
  inToggledSurface,
} from 'retil-interaction'

import { sansFontFamily } from 'lib-ui-web/style/fonts'

import app from '~/appScheme'

export const StyledMatchedLinkSurface = styled(MatchedLinkSurface)`
  display: flex;
`

const NavLinkBody: React.FunctionComponent<JSX.IntrinsicElements['span']> = (
  props,
) => (
  <span
    {...props}
    css={(theme) => [
      css`
        color: ${theme.color.onSurface};
        font-family: ${sansFontFamily};
        font-size: 0.9rem;
        font-weight: 700;
        line-height: 38px;
        padding-top: 2px;
        margin: 0 0.5rem;
      `,
      inToggledSurface(css`
        border-bottom: 2px solid ${theme.color.onSurface};
      `),
    ]}
  />
)

export interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <div
    css={css`
      flex-grow: 1;

      display: flex;
      flex-direction: column;
    `}>
    <nav
      css={({ color }) => css`
        background-color: ${color.surface};
        border-bottom: 1px solid ${color.surfaceBorder};
        display: flex;
        padding: 0 1rem;
      `}>
      <StyledMatchedLinkSurface href={app.top()} match={app.top()}>
        <NavLinkBody
          css={({ color }) => css`
            color: ${color.primary};
            font-family: Inconsolata, monospace;
            font-size: 18px;
            font-weight: 900;
            margin-top: -2px;
          `}>
          letter.house{' '}
          <span css={(theme) => ({ color: theme.color.onSurface })}>
            storyboard
          </span>
        </NavLinkBody>
      </StyledMatchedLinkSurface>
      <div
        css={css`
          margin: 0 1rem;
        `}>
        <StyledMatchedLinkSurface href={app.storyIndex()}>
          <NavLinkBody>stories</NavLinkBody>
        </StyledMatchedLinkSurface>
      </div>
      <div
        css={css`
          flex-grow: 1;
        `}
      />
      <div>
        {' '}
        <AnchorSurface
          css={css`
            display: flex;
          `}
          href="https://github.com/jamesknelson/sskk-monorepo">
          <NavLinkBody>GitHub</NavLinkBody>
        </AnchorSurface>
      </div>
    </nav>
    <main>{children}</main>
  </div>
)
