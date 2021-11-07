import { css } from '@emotion/react'
import React from 'react'
import { ColumnTransition } from 'src/components/columnTransition'
import { appMainZ } from 'src/presentation/zIndexes'

export interface AppLayoutProps {
  children: React.ReactNode
  transitionKey: string
}

export default function AppLayout({ children, transitionKey }: AppLayoutProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        max-width: 100%;
      `}>
      <AppNavSidebar />
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
        <AppAuthFooter />
      </div>
    </div>
  )
}
