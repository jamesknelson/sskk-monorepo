import firebase from 'firebase/app'
import {
  Source,
  act,
  createState,
  fuse,
  getSnapshotPromise,
  mergeLatest,
  observe,
  wait,
} from 'retil-source'

import { FirebaseAuthIssues, convertErrorsToIssues } from './firebaseAuthIssues'

export type FirebaseAuthService = readonly [
  FirebaseAuthSource,
  FirebaseAuthController,
]

export interface FirebaseAuthOptions {
  // If true, will always attempt to sign in anonymous users as anonymous.
  automaticallySignInAsAnonymous?: boolean

  firebaseAuth?: firebase.auth.Auth

  languageCode?: null | string

  // If provided, this will be called during `getTokenInfo()`. It allows you to
  // check that any custom claims to interface with the rest of your app are
  // available, and if not, force refresh the token to fetch them. Given that
  // this returns a promise, you can also call the server to update the user's
  // claims before returning a result.
  shouldRefreshToken?: (
    tokenInfo: firebase.auth.IdTokenResult,
    user: firebase.User,
  ) => Promise<boolean>

  // // See: https://firebase.google.com/docs/auth/admin/manage-cookies
  // // The general idea is that on login, we call a server endpoint to create a
  // // httpOnly session cookie. Then instead of handling persistence with
  // // firebase, we request a new short-term token from a server endpoint each
  // // time the user loads a page which was rendered with user data, and
  // // authenticate using that. This way we can render user-specific pages without
  // // communicating with firebase during the initial server render. It doesn't
  // // matter if it takes a little longer to verify that the user is still logged
  // // in after the initial render.
  // ssr?: {
  //   // TODO:
  //   // - provide a function that calls the server on login to create a session
  //   //   cookie
  //   // - set persistence to null
  //   // - set a token, which should either be a session cookie extracted from a
  //   //   httpOnly cookie on the server, or should be a short term token fetched
  //   //   from a separate server endpoint on the client
  //   //   https://firebase.google.com/docs/auth/admin/create-custom-tokens
  //   // - we may also want to include a "tentative" user based on data serialized
  //   //   into the html, but we *don't* want to include a token in this.
  // }

  // TODO:
  // Useful for telemetry.
  // onSignInAttempt?: () => void
  // onSignInSuccess?: (user: FirebaseAuthUser) => void
  // onSignInFailure?: () => void

  // onSignUpAttempt?: () => void
  // onSignUpSuccess?: (user: FirebaseAuthUser) => void
  // onSignUpFailure?: () => void

  // onSignOut?: (user: FirebaseAuthUser) => void
}

export type FirebaseAuthSource = Source<FirebaseAuthSnapshot>

export interface FirebaseAuthSnapshot {
  message: FirebaseAuthMessage | null
  mutableFirebaseUser: firebase.User | null
  user: FirebaseAuthUser | null
}

export interface FirebaseAuthUser {
  id: string

  isAnonymous: boolean

  providerData: {
    [providerName: string]: object
    firebase: {
      displayName: string | null
      email: string | null
      phoneNumber: string | null
      photoURL: string | null
    }
  }

  // These are split out into two separate fields, to make it more obvious
  // in cases where you're sending things to an unverified email.
  unverifiedEmail: string | null
  verifiedEmail: string | null
}

export interface FirebaseAuthMessage {
  code: FirebaseAuthMessageCode
  data: object
  message: string
}

export type FirebaseAuthMessageCode = 'redirect-login-error'

export interface FirebaseAuthCredentials {
  email: string
  password: string
}

export interface FirebaseAuthProfile {
  displayName: string | null
  photoURL: string | null
}

export interface FirebaseAuthController {
  /**
   * Can be called before applying a code, to check whether it is still valid.
   */
  checkCode(data: { code: string }): Promise<null | FirebaseAuthIssues>

  clearMessage(): void

  createUserWithPassword(
    data: FirebaseAuthCredentials & Partial<FirebaseAuthProfile>,
  ): Promise<null | FirebaseAuthIssues>

  deleteUser(): Promise<null | FirebaseAuthIssues>

  /**
   * This is data is placed on the controller instead of the source, as the
   * "current" value isn't as meaningful as the value at the specific point in
   * time when it is needed. Thus changes in the "current" value should never
   * result in any UI updates (except when changing to null, in which case
   * the source itself will change anyway).
   */
  getTokenInfo: (
    forceRefresh?: boolean,
  ) => Promise<firebase.auth.IdTokenResult | null>

  // // doesn't update state
  // // https://firebase.google.com/docs/auth/web/account-linking
  // // - firebase: user.linkWithRedirect
  // linkWithRedirect(provider: AuthProvider): void

  reauthenticateWithPassword(data: {
    password: string
  }): Promise<null | FirebaseAuthIssues>

  recoverEmail(data: { code: string }): Promise<null | FirebaseAuthIssues>

  resetPassword(data: {
    code: string
    newPassword: string
  }): Promise<null | FirebaseAuthIssues>

  // // - firebase: user.reauthenticateWithRedirect
  // reauthenticateWithRedirect(provider: AuthProvider): void

  sendEmailVerification(options?: {
    url: string
  }): Promise<null | FirebaseAuthIssues>

  sendPasswordResetEmail(
    data: { email: string },
    options?: {
      // a URL to continue to after resetting the email
      url: string
    },
  ): Promise<null | FirebaseAuthIssues>

  // Useful for account creation processes, where you'd like to ensure a user
  // record is created in your database with the correct id *before* creating
  // an auth record -- preventing issues where closing the browser in the middle
  // of the account creation process results in orpahned auth records.
  signInAnonymously(): Promise<void>

  signInWithPassword(
    data: FirebaseAuthCredentials,
  ): Promise<null | FirebaseAuthIssues>

  // // - firebase: auth.signInWithRedirect
  // //             or if logged in anonymously,
  // //             user.linkWithRedirect(authProvider)
  // signInWithRedirect(
  //   // some opaque object
  //   provider: AuthProvider,
  // ): void

  signOut(): void

  // // - firebase: user.unlink(providerId)
  // unlink(data: { providerId: string }): Promise<null | Issues>

  updateEmail(data: { newEmail: string }): Promise<null | FirebaseAuthIssues>

  updatePassword(data: {
    newPassword: string
  }): Promise<null | FirebaseAuthIssues>

  updateProfile(
    data: Partial<FirebaseAuthProfile>,
  ): Promise<null | FirebaseAuthIssues>

  verifyEmail(data: { code: string }): Promise<null | FirebaseAuthIssues>
}

export function createFirebaseAuthService(
  options: FirebaseAuthOptions = {},
): FirebaseAuthService {
  const {
    automaticallySignInAsAnonymous,
    firebaseAuth = firebase.auth(),
    languageCode = null,
    shouldRefreshToken,
  } = options

  firebaseAuth.languageCode = languageCode

  const mutableFirebaseUserSource = observe<firebase.User | null>(
    (next, error, complete) =>
      firebaseAuth.onAuthStateChanged(next, error, complete),
  )

  const [userVersionSource, setUserVersion] = createState(1)
  const incrementUserVersion = () => setUserVersion((version) => version + 1)

  const authWithoutMessagesSource = fuse<Omit<FirebaseAuthSnapshot, 'message'>>(
    (use, effect) => {
      // Incrementing this source allows us to imperatively output a new auth
      // object, which is handy as some firebase methods do not cause a new
      // user object to be emitted by onAuthStateChanged.
      use(userVersionSource)

      const mutableFirebaseUser = use(mutableFirebaseUserSource)

      if (automaticallySignInAsAnonymous && mutableFirebaseUser === null) {
        effect(async () => {
          const { user: firebaseUser } = await firebaseAuth.signInAnonymously()
          await wait(mutableFirebaseUserSource, (x) => x === firebaseUser)
        })

        return {
          mutableFirebaseUser,
          user: null,
        }
      }

      const user: FirebaseAuthUser | null = mutableFirebaseUser
        ? {
            id: mutableFirebaseUser.uid,
            isAnonymous: mutableFirebaseUser.isAnonymous,
            providerData: {
              firebase: {
                displayName: mutableFirebaseUser.displayName,
                email: mutableFirebaseUser.email,
                phoneNumber: mutableFirebaseUser.phoneNumber,
                photoURL: mutableFirebaseUser.photoURL,
              },
            },
            unverifiedEmail: mutableFirebaseUser.emailVerified
              ? null
              : mutableFirebaseUser.email,
            verifiedEmail: mutableFirebaseUser.emailVerified
              ? mutableFirebaseUser.email
              : null,
          }
        : null

      return {
        mutableFirebaseUser: mutableFirebaseUser,
        user: user,
      }
    },
  )

  // TODO: add initial messages
  // Messages get added in a separate `fuse`, to ensure that clearing messages
  // doesn't cause a new `user` object to be created.
  const [messageSource, setMessage] = createState<FirebaseAuthMessage | null>(
    null,
  )
  const authSource = fuse<FirebaseAuthSnapshot>((use) => {
    const message = use(messageSource)
    const auth = use(authWithoutMessagesSource)
    return {
      ...auth,
      message,
    }
  })

  const authController: FirebaseAuthController = {
    checkCode: async (data): Promise<null | FirebaseAuthIssues> =>
      convertErrorsToIssues(() => firebaseAuth.checkActionCode(data.code), {
        'expired-action-code': { code: 'expired' },
        'invalid-action-code': { code: 'already-used' },
        'user-disabled': 'user-disabled',
        'user-not-found': 'user-not-found',
      }),

    clearMessage() {
      setMessage(null)
    },

    createUserWithPassword: async (data): Promise<null | FirebaseAuthIssues> =>
      act(authSource, async () => {
        const hasProfile = data.displayName || data.photoURL

        let firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
        if (firebaseUser && !firebaseUser.isAnonymous) {
          return {
            codes: ['already-logged-in'],
            message:
              "You're already logged into an account! If you really want to create a new account, please log out of your existing account first.",
          }
        }

        return convertErrorsToIssues(
          async () => {
            let didCreatedAnonymousUser = false
            if (hasProfile && !firebaseUser) {
              firebaseUser = (await firebaseAuth.signInAnonymously()).user!
              didCreatedAnonymousUser = true
              await wait(
                mutableFirebaseUserSource,
                (x) => !!(x && x.uid === firebaseUser!.uid),
              )

              await firebaseUser.updateProfile({
                displayName: data.displayName || null,
                photoURL: data.photoURL || null,
              })
            }

            if (firebaseUser) {
              try {
                await firebaseUser.linkWithCredential(
                  firebase.auth.EmailAuthProvider.credential(
                    data.email,
                    data.password,
                  ),
                )
                await firebaseUser.reload()
                incrementUserVersion()
              } catch (error) {
                if (didCreatedAnonymousUser) {
                  await firebaseAuth.signOut()
                }
                throw error
              }
            } else {
              firebaseUser = (
                await firebaseAuth.createUserWithEmailAndPassword(
                  data.email,
                  data.password,
                )
              ).user!
            }

            await firebaseUser.sendEmailVerification()
          },
          {
            'credential-already-in-use': {
              // Indicates you can sign in with this credential
              email: 'already-in-use',
            },
            'email-already-in-use': {
              // Indicates you'll need to sign in with another provider before
              // linking this credential
              email: 'already-in-use',
            },
            'invalid-email': { email: 'invalid' },
            'weak-password': { password: 'weak' },
            'wrong-password': {
              // Indicates the email exists and you used the wrong password,
              // or (?) that an account exists with that email and no password,
              // e.g. using a social provider.
              email: 'already-in-use',
            },
          },
        )
      }),

    deleteUser: (): Promise<null | FirebaseAuthIssues> => {
      return act(authSource, async () => {
        const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
        if (!firebaseUser || firebaseUser.isAnonymous) {
          return {
            codes: ['not-logged-in'],
            message: 'You must be logged in to delete your account.',
          }
        }

        return convertErrorsToIssues(
          async () => {
            await firebaseUser.delete()
          },
          {
            'requires-recent-login': 'requires-recent-login',
          },
        )
      })
    },

    getTokenInfo: async (forceRefresh?: boolean) => {
      const mutableFirebaseUser = await getSnapshotPromise(
        mutableFirebaseUserSource,
      )
      if (
        !mutableFirebaseUser ||
        !firebaseAuth.currentUser ||
        firebaseAuth.currentUser.uid !== mutableFirebaseUser.uid
      ) {
        return null
      }

      // For some reason, this function doesn't exist on the user received
      // by onStateChange, so we need to look on the underlying firebase auth
      // instance.
      const tokenInfo = await firebaseAuth.currentUser.getIdTokenResult(
        forceRefresh,
      )

      if (!tokenInfo || forceRefresh) {
        return tokenInfo || null
      }

      if (
        shouldRefreshToken &&
        (await shouldRefreshToken(tokenInfo, mutableFirebaseUser))
      ) {
        return firebaseAuth.currentUser?.getIdTokenResult(true) || null
      } else {
        return tokenInfo
      }
    },

    reauthenticateWithPassword: async (
      data,
    ): Promise<null | FirebaseAuthIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return {
          codes: ['not-logged-in'],
          message: 'You must be logged in to delete your account.',
        }
      }

      return convertErrorsToIssues(
        async () => {
          await firebaseUser.reauthenticateWithCredential(
            firebase.auth.EmailAuthProvider.credential(
              firebaseUser.email!,
              data.password,
            ),
          )
        },
        {
          'wrong-password': { password: 'mismatch' },
        },
      )
    },

    recoverEmail: async (data): Promise<null | FirebaseAuthIssues> => {
      return convertErrorsToIssues(
        async () => {
          const actionCodeInfo = await firebaseAuth.checkActionCode(data.code)
          if (actionCodeInfo.operation !== 'RECOVER_EMAIL') {
            throw new Error('Action code type mismatch')
          }

          await firebaseAuth.applyActionCode(data.code)
          incrementUserVersion()
        },
        {
          'expired-action-code': { code: 'expired' },
          'invalid-action-code': { code: 'already-used' },
          'user-disabled': 'user-disabled',
          'user-not-found': 'user-not-found',
        },
      )
    },

    resetPassword: (data): Promise<null | FirebaseAuthIssues> => {
      return act(authSource, async () => {
        const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)

        return convertErrorsToIssues(
          async () => {
            const email = await firebaseAuth.verifyPasswordResetCode(data.code)

            if (
              firebaseUser &&
              !firebaseUser.isAnonymous &&
              firebaseUser.email !== email
            ) {
              return {
                codes: ['account-mismatch'],
                message:
                  "You're logged into a different account. Please log out before resetting your password.",
              }
            }

            await firebaseAuth.confirmPasswordReset(data.code, data.newPassword)
            await firebaseAuth.signInWithCredential(
              firebase.auth.EmailAuthProvider.credential(
                email,
                data.newPassword,
              ),
            )
          },
          {
            'expired-action-code': { code: 'expired' },
            'invalid-action-code': { code: 'already-used' },
            'user-disabled': 'user-disabled',
            'user-not-found': 'user-not-found',
            'weak-password': { password: 'weak' },
          },
        )
      })
    },

    sendEmailVerification: async (
      options,
    ): Promise<null | FirebaseAuthIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return {
          codes: ['not-logged-in'],
          message: 'You must be logged in to resend your verification.',
        }
      }

      await firebaseUser.sendEmailVerification(options)

      return null
    },

    sendPasswordResetEmail: async (
      data,
      options,
    ): Promise<null | FirebaseAuthIssues> => {
      return convertErrorsToIssues(
        async () => {
          await firebaseAuth.sendPasswordResetEmail(data.email, options)
        },
        {
          'invalid-email': { email: 'invalid' },
          'user-not-found': { email: 'not-found' },
        },
      )
    },

    signInAnonymously: (): Promise<void> =>
      act(authSource, async () => {
        const mutableFirebaseUser = await getSnapshotPromise(
          mutableFirebaseUserSource,
        )

        if (!mutableFirebaseUser || !mutableFirebaseUser.isAnonymous) {
          const { user: firebaseUser } = await firebaseAuth.signInAnonymously()
          await wait(mutableFirebaseUserSource, (x) => x !== firebaseUser)
        }
      }),

    signInWithPassword: (data) =>
      act(authSource, async () => {
        return convertErrorsToIssues(
          async () => {
            await firebaseAuth.signInWithEmailAndPassword(
              data.email,
              data.password,
            )
          },
          {
            'invalid-email': { email: 'invalid' },
            'user-disabled': 'user-disabled',
            'user-not-found': { email: 'not-found' },
            'wrong-password': { password: 'mismatch' },
          },
        )
      }),

    // signInWithRedirect(provider) {
    //   auth.signInWithRedirect(provider)
    // },

    signOut: () => {
      // Don't wrap with act, as we want to see the intermediate states (so
      // that we get an immediate change in the UI).
      return firebaseAuth.signOut()
    },

    updateEmail: async (data): Promise<null | FirebaseAuthIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return {
          codes: ['not-logged-in'],
          message: 'You must be logged in to resend your verification.',
        }
      }

      return act(authSource, async () => {
        return convertErrorsToIssues(
          async () => {
            await firebaseUser.updateEmail(data.newEmail)
            incrementUserVersion()
          },
          {
            'email-already-in-use': { email: 'already-in-use' },
            'invalid-email': { email: 'invalid' },
            'requires-recent-login': 'requires-recent-login',
          },
        )
      })
    },

    updatePassword: async (data): Promise<null | FirebaseAuthIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return {
          codes: ['not-logged-in'],
          message: 'You must be logged in to resend your verification.',
        }
      }

      return act(authSource, async () => {
        return convertErrorsToIssues(
          async () => {
            // TODO:
            // if the user curerntly has no password, e.g. due to signing in with facebook,
            // - user.linkWithCredential(firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, 'password'))
            await firebaseUser.updatePassword(data.newPassword)
            incrementUserVersion()
          },
          {
            'weak-password': { password: 'weak' },
            'requires-recent-login': 'requires-recent-login',
          },
        )
      })
    },

    updateProfile: async (data): Promise<null | FirebaseAuthIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return {
          codes: ['not-logged-in'],
          message: 'You must be logged in to resend your verification.',
        }
      }

      return act(authSource, async () => {
        // Not calling convertErrorsToIssues, as there are no known errors.
        await firebaseUser.updateProfile(data)
        incrementUserVersion()
        return null
      })
    },

    verifyEmail: (data): Promise<null | FirebaseAuthIssues> => {
      return convertErrorsToIssues(
        async () => {
          const actionCodeInfo = await firebaseAuth.checkActionCode(data.code)
          if (actionCodeInfo.operation !== 'VERIFY_EMAIL') {
            throw new Error('Action code type mismatch')
          }

          await firebaseAuth.applyActionCode(data.code)
          incrementUserVersion()
        },
        {
          'expired-action-code': { code: 'expired' },
          'invalid-action-code': { code: 'already-used' },
          'user-disabled': 'user-disabled',
          'user-not-found': 'user-not-found',
        },
      )
    },
  }

  return [mergeLatest(authSource), authController]
}
