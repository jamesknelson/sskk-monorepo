import { ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'
import { Boundary } from 'retil-boundary'
import { useBoundaryHydrater } from 'retil-hydration'
import { useMountContent } from 'retil-mount'
import { useBoundaryNavScroller } from 'retil-nav'

import { AuthProvider, useAppEnv } from 'src/env'

import { AppLayout } from './appLayout'
import { AppLoading } from './appLoading'

export const App = () => {
  const env = useAppEnv()
  const content = useMountContent<ReactNode>()

  useBoundaryHydrater()
  useBoundaryNavScroller()

  return (
    <ApolloProvider client={env.client}>
      <AuthProvider>
        <AppLayout>
          <Boundary fallback={<AppLoading />}>{content}</Boundary>
        </AppLayout>
      </AuthProvider>
    </ApolloProvider>
  )
}
