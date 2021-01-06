import { NextilRequest } from 'nextil'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { useRouterRequest } from 'retil-router'
import { createState } from 'retil-source'

import { auth as authConfig } from 'src/config'
import {
  createFirebaseAuthService,
  FirebaseAuthController as AuthController,
  FirebaseAuthSnapshot as AuthSnapshot,
  FirebaseAuthService as AuthService,
  FirebaseAuthSource as AuthSource,
  FirebaseAuthUser as AuthUser,
} from 'src/services/firebaseAuthService'

export type { AuthController, AuthSnapshot, AuthService, AuthSource, AuthUser }

const [pendingSource] = createState<AuthSnapshot>()

const authServiceRef: { current?: AuthService } = {}
const anonymousAuthService = createAnonymousAuthService()
const pendingAuthService = [pendingSource, {} as any] as const

export function getAuthService(request: NextilRequest): AuthService {
  if (!request.isRoutedPage) {
    return anonymousAuthService
  } else if (request.isSSR) {
    return pendingAuthService
  } else if (!authServiceRef.current) {
    authServiceRef.current = createFirebaseAuthService({
      automaticallySignInAsAnonymous: false,

      shouldRefreshToken: async (tokenInfo, user) => {
        if (tokenInfo.claims['https://hasura.io/jwt/claims']) {
          return false
        }

        await fetch(`${authConfig.refreshTokenEndpoint}?uid=${user.uid}`)

        return true
      },
    })
  }
  return authServiceRef.current
}

export function createAnonymousAuthService(): AuthService {
  const [source] = createState<AuthSnapshot>({
    message: null,
    mutableFirebaseUser: null,
    user: null,
  })
  const controller: AuthController = {} as any
  return [source, controller] as const
}

const AuthControllerContext = createContext<AuthController>(null as any)

export interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const request = useRouterRequest<NextilRequest>()
  const [, controller] = getAuthService(request)

  return (
    <AuthControllerContext.Provider value={controller}>
      {children}
    </AuthControllerContext.Provider>
  )
}

export function useAuthController(): AuthController {
  return useContext(AuthControllerContext)
}
