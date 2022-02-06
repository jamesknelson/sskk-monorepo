import { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { createState } from 'retil-source'

import { auth as authConfig } from '~/config'

import { createAuthService } from './authService'
import {
  AuthController,
  AuthSnapshot,
  AuthService,
  AuthSource,
  AuthUser,
  AuthTokenInfoGetter,
} from './authServiceTypes'

import { getFirebaseApp } from '../firebase'

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
    authServiceRef.current = createAuthService({
      firebaseApp: getFirebaseApp(),
      shouldRefreshToken: async (tokenInfo) => {
        if (tokenInfo.claims.customer_id) {
          return false
        }

        await fetch(authConfig.refreshTokenEndpoint, {
          method: 'post',
          body: JSON.stringify({ token: tokenInfo.token }),
        })

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
