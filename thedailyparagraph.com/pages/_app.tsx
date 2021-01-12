import 'prosemirror-example-setup/style/style.css'
import 'prosemirror-gapcursor/style/gapcursor.css'
import 'prosemirror-menu/style/menu.css'
import 'prosemirror-view/style/prosemirror.css'

import firebase from 'firebase/app'
import 'firebase/auth'
import { AppProps as NextAppProps } from 'next/app'
import { NextilAppProps, NextilRouter, nextilApp } from 'nextil'
import * as React from 'react'
import { useRouterContent, useRouterRequest } from 'retil-router'
import { ApolloProvider } from '@apollo/client'

import { AppLayout } from 'src/components/appLayout'
import { firebase as firebaseConfig, firebaseEmulators } from 'src/config'
import { GlobalStyles } from 'src/globalStyles'
import { HydrationBoundary } from 'src/utils/hydration'
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
            <AppLayout>
              <HydrationBoundary fallback={<LoadingFallback />}>
                <Content />
              </HydrationBoundary>
            </AppLayout>
          </AuthProvider>
        </ClientProvider>
      </NextilRouter>
    </>
  )
}

function Content() {
  const content = useRouterContent()
  return <>{content}</>
}

function ClientProvider(props: { children: React.ReactNode }) {
  const request = useRouterRequest() as AppRequest
  return request.client ? (
    <ApolloProvider client={request.client}>{props.children}</ApolloProvider>
  ) : (
    <>{props.children}</>
  )
}

function LoadingFallback() {
  return <div>Loading...</div>
}

export default nextilApp(App, {
  notFoundRouter: () => <NotFoundPage />,
})
