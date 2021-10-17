// import { NextilRequest } from 'nextil'
import { ReactNode } from 'react'
import { createContext, useContext } from 'react'
// import { useRouterRequest } from 'retil-router'
import { createState } from 'retil-source'

import { auth as authConfig } from 'src/config'
import { createFirebaseAuthService } from './firebaseAuthService'
import {
  FirebaseAuthController as AuthController,
  FirebaseAuthSnapshot as AuthSnapshot,
  FirebaseAuthService as AuthService,
  FirebaseAuthSource as AuthSource,
  FirebaseAuthUser as AuthUser,
  FirebaseTokenInfoGetter as AuthTokenInfoGetter,
} from './firebaseAuthTypes'

export type {
  AuthController,
  AuthSnapshot,
  AuthService,
  AuthSource,
  AuthTokenInfoGetter,
  AuthUser,
}

const [pendingSource] = createState<AuthSnapshot>()

const authServiceRef: { current?: AuthService } = {}
const pendingAuthService = [pendingSource, {} as any] as const

export function getAuthService(): AuthService {
  if (typeof window === 'undefined') {
    return pendingAuthService
  } else if (!authServiceRef.current) {
    authServiceRef.current = createFirebaseAuthService({
      shouldRefreshToken: async (tokenInfo, user) => {
        if (tokenInfo.claims.customer_id) {
          return false
        }

        await fetch(`${authConfig.refreshTokenEndpoint}?uid=${user.uid}`)

        return true
      },
    })
  }
  return authServiceRef.current
}

const AuthControllerContext = createContext<AuthController>(null as any)

export interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // const request = useRouterRequest<NextilRequest>()
  const [, controller] = getAuthService()

  return (
    <AuthControllerContext.Provider value={controller}>
      {children}
    </AuthControllerContext.Provider>
  )
}

export function useAuthController(): AuthController {
  return useContext(AuthControllerContext)
}
