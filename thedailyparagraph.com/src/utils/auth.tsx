import { NextilRequest } from 'nextil'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { useRouterRequest } from 'retil-router'
import { createState, useSource } from 'retil-source'

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
  }
  if (request.isSSR) {
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

const AuthSourceContext = createContext<AuthSource>(null as any)
const AuthControllerContext = createContext<AuthController>(null as any)

export interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const request = useRouterRequest<NextilRequest>()
  const [source, controller] = getAuthService(request)

  return (
    <AuthSourceContext.Provider value={source}>
      <AuthControllerContext.Provider value={controller}>
        {children}
      </AuthControllerContext.Provider>
    </AuthSourceContext.Provider>
  )
}

export function useAuthController(): AuthController {
  return useContext(AuthControllerContext)
}

export function useAuthSnapshot<User = any, DefaultSnapshot = User>(
  options: {
    defaultValue?: DefaultSnapshot
  } = {},
): AuthSnapshot | DefaultSnapshot {
  const source = useContext(AuthSourceContext)
  const snapshot = useSource(source, options)
  return snapshot as AuthSnapshot | DefaultSnapshot
}

export function useCurrentUser<User = any, DefaultUser = User>(
  options: {
    defaultValue?: DefaultUser
  } = {},
): User | DefaultUser | null {
  const snapshotOptions =
    'defaultValue' in options
      ? { defaultValue: { currentUser: options.defaultValue } }
      : {}
  const snapshot = useAuthSnapshot(snapshotOptions) as AuthSnapshot
  return (snapshot as any).currentUser
}
