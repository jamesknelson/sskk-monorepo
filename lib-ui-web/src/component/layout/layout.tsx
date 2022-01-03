import { css } from '@emotion/react'
import React from 'react'

import { ColumnTransition } from 'src/components/web/transition/columnTransition'
import { appMainZ } from 'src/style/zIndexes'

import { LayoutAuthFooter } from './layoutAuthFooter'
import { LayoutNav } from './layoutNav'

export interface LayoutProps {
  children: React.ReactNode
  transitionKey: string
}

export function Layout({ children, transitionKey }: LayoutProps) {
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
        <LayoutAuthFooter />
      </div>
    </div>
  )
}
