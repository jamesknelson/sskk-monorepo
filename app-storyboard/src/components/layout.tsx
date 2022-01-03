import { css } from '@emotion/react'
import {
  AnchorSurface,
  MatchedLinkSurface,
  inToggledSurface,
} from 'retil-interaction'

import appScheme from '~/appScheme'

const NavLinkBody: React.FunctionComponent<JSX.IntrinsicElements['span']> = (
  props,
) => (
  <span
    {...props}
    css={(theme) => [
      css`
        color: ${theme.color.tertiary};
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 40px;
        margin: 0 0.5rem;
      `,
      inToggledSurface(css`
        border-bottom: 2px solid ${theme.color.primary};
      `),
    ]}
  />
)

export interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <>
    <nav
      css={({ color }) => css`
        border-bottom: 1px solid ${color.surfaceLine};
        display: flex;
        padding: 0 1rem;
      `}>
      <MatchedLinkSurface href={appScheme.top()} match={appScheme.top()}>
        <NavLinkBody
          css={({ color }) => css`
            color: ${color.primary};
            font-family: Inconsolata, monospace;
            font-size: 18px;
            font-weight: 900;
          `}>
          retil.tech
        </NavLinkBody>
      </MatchedLinkSurface>
      <div
        css={css`
          flex-grow: 1;
        `}
      />
      <div
        css={css`
          margin: 0 1rem;
        `}>
        <MatchedLinkSurface href={appScheme.storyIndex()}>
          <NavLinkBody>stories</NavLinkBody>
        </MatchedLinkSurface>
      </div>
      <div>
        {' '}
        <AnchorSurface href="https://github.com/jamesknelson/sskk-monorepo">
          <NavLinkBody>GitHub</NavLinkBody>
        </AnchorSurface>
      </div>
    </nav>
    <main>{children}</main>
  </>
)
