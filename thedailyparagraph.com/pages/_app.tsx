import firebase from 'firebase/app'
import 'firebase/auth'
import { AppProps as NextAppProps } from 'next/app'
import { NextilAppProps, NextilRouter, nextilApp } from 'nextil'
import * as React from 'react'
import { RouterContent, useRouterRequest } from 'retil-router'
import { Provider as URQLProvider } from 'urql'

import { AppLayout } from 'src/components/appLayout'
import { firebase as firebaseConfig, firebaseEmulators } from 'src/config'
import { GlobalStyles } from 'src/globalStyles'
import { HydrationBoundary } from 'src/hooks/useHasHydrated'
import { AuthProvider } from 'src/utils/auth'
import { AppRequest } from 'src/utils/routing'

import NotFoundPage from './404'

if (typeof window !== 'undefined') {
  firebase.initializeApp(firebaseConfig)

  const auth = firebase.auth()
  if (firebaseEmulators.auth) {
    auth.useEmulator(firebaseEmulators.auth)
  }
}

interface AppProps extends NextAppProps, NextilAppProps {}

function App(_props: AppProps) {
  return (
    <>
      <GlobalStyles />
      <NextilRouter>
        <ClientProvider>
          <AuthProvider>
            <HydrationBoundary>
              <AppLayout>
                <HydrationBoundary fallback={<>loading</>}>
                  <RouterContent />
                </HydrationBoundary>
              </AppLayout>
            </HydrationBoundary>
          </AuthProvider>
        </ClientProvider>
      </NextilRouter>
    </>
  )
}

export function ClientProvider(props: { children: React.ReactNode }) {
  const request = useRouterRequest() as AppRequest
  return <URQLProvider value={request.client}>{props.children}</URQLProvider>
}

export default nextilApp(App, {
  notFoundRouter: () => <NotFoundPage />,
})
