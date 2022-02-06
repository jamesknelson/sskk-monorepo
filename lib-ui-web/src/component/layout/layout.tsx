import { css } from '@emotion/react'
import React from 'react'
import { ColumnTransition } from 'retil-transition'

import { appMainZ } from '~/style/zIndexes'

import { LayoutAuthFooter, LayoutAuthFooterScheme } from './layoutAuthFooter'
import { LayoutNav } from './layoutNav'

export interface LayoutProps {
  children: React.ReactNode
  scheme: LayoutAuthFooterScheme
  showAuthFooter?: boolean
  transitionKey: string
}

export function Layout({
  children,
  scheme,
  showAuthFooter,
  transitionKey,
}: LayoutProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        max-width: 100%;
      `}>
      <LayoutNav />
      <div
        css={css`
          flex-grow: 1;

          display: flex;
          flex-direction: column;
        `}>
        <main
          css={css`
            position: relative;
            flex-grow: 1;
            z-index: ${appMainZ};

            display: flex;
            flex-direction: column;
          `}>
          <ColumnTransition
            css={css`
              flex-grow: 1;
            `}
            children={children}
            transitionKey={transitionKey}
          />
        </main>
        <LayoutAuthFooter active={!!showAuthFooter} scheme={scheme} />
      </div>
    </div>
  )
}
