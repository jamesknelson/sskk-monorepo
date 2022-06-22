import { FirebaseApp } from 'firebase/app'
import {
  EmailAuthProvider,
  IdTokenResult,
  User as FirebaseAuthUser,
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  linkWithCredential,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateEmail,
  updateProfile,
  updatePassword,
  verifyPasswordResetCode,
} from 'firebase/auth'
import {
  act,
  createState,
  fuse,
  getSnapshot,
  getSnapshotPromise,
  hasSnapshot,
  observe,
  reduceVector,
  subscribe,
  wait,
} from 'retil-source'
import { emptyObject } from 'retil-support'

import { convertFirebaseErrorsToIssues } from './authServiceIssues'
import {
  AuthController,
  AuthMessage,
  AuthService,
  AuthSnapshot,
  AuthUser,
  AuthTokenInfoGetter,
  //
  CreateUserWithPasswordCodes,
  CreateUserWithPasswordRequest,
  ReauthenticateWithPasswordCodes,
  ReauthenticateWithPasswordRequest,
  SendPasswordResetEmailCodes,
  SendPasswordResetEmailRequest,
  SignInWithPasswordCodes,
  SignInWithPasswordRequest,
  UpdatePasswordCodes,
  UpdatePasswordRequest,
} from './authServiceTypes'

export interface AuthServiceOptions {
  firebaseApp: FirebaseApp

  languageCode?: null | string

  // If provided, this will be called during `getTokenInfo()`. It allows you to
  // check that any custom claims to interface with the rest of your app are
  // available, and if not, force refresh the token to fetch them. Given that
  // this returns a promise, you can also call the server to update the user's
  // claims before returning a result.
  shouldRefreshToken?: (
    tokenInfo: IdTokenResult,
    user: FirebaseAuthUser,
  ) => Promise<boolean>

  /**
   * Called whenever a user is authenticated, including after login and
   * registration, and also when a user is first authenticated after hydration.
   */
  onAuthenticated?: (user: AuthUser, tokenResult: IdTokenResult) => void

  onSignInSuccess?: (user: AuthUser, tokenResult: IdTokenResult) => void

  onSignUpFailure?: () => void
  onSignUpSuccess?: (user: AuthUser, tokenResult: IdTokenResult) => void

  // onSignOut?: (user: FirebaseAuthUser) => void

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
}

export function createAuthService(options: AuthServiceOptions): AuthService {
  const {
    firebaseApp,
    languageCode = null,
    shouldRefreshToken,

    onAuthenticated,

    onSignInSuccess,

    onSignUpFailure,
    onSignUpSuccess,
  } = options

  const firebaseAuth = getAuth(firebaseApp)

  firebaseAuth.languageCode = languageCode

  const getTokenInfoForUser = async (
    user: FirebaseAuthUser | null,
    forceRefresh?: boolean,
  ) => {
    if (
      !user ||
      !firebaseAuth.currentUser ||
      firebaseAuth.currentUser.uid !== user.uid
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

    if (shouldRefreshToken && (await shouldRefreshToken(tokenInfo, user))) {
      return firebaseAuth.currentUser?.getIdTokenResult(true) || null
    } else {
      return tokenInfo
    }
  }

  const [claimsSource, setLatestClaims] =
    createState<Record<string, any>>(emptyObject)

  let signOutDepth = 0

  const mutableFirebaseUserSource = observe<FirebaseAuthUser | null>(
    (next, error, complete) =>
      // TODO: fetch token, and put the claims on the result
      firebaseAuth.onAuthStateChanged(
        (user) => {
          if (!user || !signOutDepth) {
            getTokenInfoForUser(user?.isAnonymous ? null : user).then(
              (tokenInfo) => {
                act(authWithoutMessagesSource, () => {
                  setLatestClaims(tokenInfo?.claims || emptyObject)
                  next(user)
                })
              },
              error,
            )
          }
        },
        error,
        complete,
      ),
  )

  const [userVersionSource, setUserVersion] = createState(1)
  const incrementUserVersion = () => setUserVersion((version) => version + 1)

  const authWithoutMessagesSource = fuse<Omit<AuthSnapshot, 'message'>>(
    (use, _, memo) => {
      // Incrementing this source allows us to imperatively output a new auth
      // object, which is handy as some firebase methods do not cause a new
      // user object to be emitted by onAuthStateChanged.
      use(userVersionSource)

      const mutableFirebaseUser = use(mutableFirebaseUserSource)
      const claims = use(claimsSource)

      const getTokenInfo = memo(
        (
          mutableFirebaseUser: FirebaseAuthUser | null,
        ): AuthTokenInfoGetter | null => {
          if (!mutableFirebaseUser) {
            return null
          } else {
            const getTokenInfo: AuthTokenInfoGetter = async (
              forceRefresh?: boolean,
            ) => {
              const tokenInfo = await getTokenInfoForUser(
                mutableFirebaseUser,
                forceRefresh,
              )
              // Claims won't be reference equal, but since they're built the same way,
              // equivalent claims should produce the same stringified output.
              const areTokensEqual =
                JSON.stringify(tokenInfo?.claims) ===
                JSON.stringify(await getSnapshotPromise(claimsSource))
              if (!areTokensEqual) {
                setLatestClaims(tokenInfo?.claims || emptyObject)
              }
              return tokenInfo
            }
            return getTokenInfo
          }
        },
        [mutableFirebaseUser],
      )

      const user: AuthUser | null = mutableFirebaseUser
        ? {
            id: mutableFirebaseUser.uid,
            claims,
            getTokenInfo: getTokenInfo!,
            mutableFirebaseUser: mutableFirebaseUser,
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
        user: user,
      }
    },
  )

  // TODO: add initial messages
  // Messages get added in a separate `fuse`, to ensure that clearing messages
  // doesn't cause a new `user` object to be created.
  const [messageSource, setMessage] = createState<AuthMessage | null>(null)
  const authSource = fuse<AuthSnapshot>((use) => {
    const message = use(messageSource)
    const auth = use(authWithoutMessagesSource)
    return {
      ...auth,
      message,
    }
  })

  // Set up a subscriber to notify any authentication handler
  if (onAuthenticated) {
    let lastAuthenticatedId: undefined | null | string
    subscribe(authSource, async () => {
      if (hasSnapshot(authSource)) {
        const auth = getSnapshot(authSource)
        const authenticatedId = auth?.user?.id || null

        if (authenticatedId !== lastAuthenticatedId) {
          if (auth?.user?.mutableFirebaseUser) {
            const tokenResult =
              await auth.user.mutableFirebaseUser.getIdTokenResult()
            onAuthenticated(auth.user, tokenResult)
          }
          lastAuthenticatedId = authenticatedId
        }
      }
    })
  }

  const authController: AuthController = {
    checkCode: async (data) =>
      convertFirebaseErrorsToIssues(
        () => checkActionCode(firebaseAuth, data.code),
        {
          'expired-action-code': { code: 'expired' },
          'invalid-action-code': { code: 'already-used' },
          'user-disabled': 'user-disabled',
          'user-not-found': 'user-not-found',
        },
      ),

    clearMessage() {
      setMessage(null)
    },

    createUserWithPassword: async (data) =>
      act(authWithoutMessagesSource, async () => {
        const hasProfile = data.displayName || data.photoURL

        let firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
        if (firebaseUser && !firebaseUser.isAnonymous) {
          return [
            {
              code: 'alreadyLoggedIn',
              message:
                "You're already logged into an account! If you really want to create a new account, please log out of your existing account first.",
            },
          ]
        }

        const issuesPromise = convertFirebaseErrorsToIssues<
          CreateUserWithPasswordRequest,
          CreateUserWithPasswordCodes
        >(
          async () => {
            let didCreatedAnonymousUser = false
            if (hasProfile && !firebaseUser) {
              firebaseUser = (await signInAnonymously(firebaseAuth)).user!
              didCreatedAnonymousUser = true
              await wait(
                mutableFirebaseUserSource,
                (x) => !!(x && x.uid === firebaseUser!.uid),
              )

              await updateProfile(firebaseUser, {
                displayName: data.displayName || undefined,
                photoURL: data.photoURL || undefined,
              })
            }

            if (firebaseUser) {
              try {
                await linkWithCredential(
                  firebaseUser,
                  EmailAuthProvider.credential(data.email, data.password),
                )

                // linkWithCredential doesn't cause `onAuthStateChange` to be
                // called, so we'll need to update the token and claims
                // manually (if required).
                const tokenInfo = await getTokenInfoForUser(firebaseUser)
                setLatestClaims(tokenInfo?.claims || emptyObject)
                incrementUserVersion()
              } catch (error) {
                if (didCreatedAnonymousUser) {
                  await firebaseAuth.signOut()
                }
                throw error
              }
            } else {
              firebaseUser = (
                await createUserWithEmailAndPassword(
                  firebaseAuth,
                  data.email,
                  data.password,
                )
              ).user!
            }

            // Don't bother waiting the email send to complete
            sendEmailVerification(firebaseUser)
          },
          {
            'credential-already-in-use': {
              // Indicates you can sign in with this credential
              email: 'taken',
            },
            'email-already-in-use': {
              // Indicates you'll need to sign in with another provider before
              // linking this credential
              email: 'taken',
            },
            'invalid-email': { email: 'invalid' },
            'weak-password': { password: 'weak' },
            'wrong-password': {
              // Indicates the email exists and you used the wrong password,
              // or (?) that an account exists with that email and no password,
              // e.g. using a social provider.
              // FIXME: show a message asking the user to log in with their
              // social provider
              email: 'taken',
            },
          },
        )

        if (onSignUpFailure) {
          issuesPromise.then((issues) => {
            if (issues) {
              onSignUpFailure()
            }
          })
        }

        if (onSignUpSuccess) {
          // Don't await, as it'll cause a deadlock, and we don't need to
          // wait anyway.
          getSnapshotPromise(authWithoutMessagesSource).then(async (auth) => {
            if (auth.user?.mutableFirebaseUser) {
              const user = auth.user
              const tokenResult =
                await auth.user.mutableFirebaseUser.getIdTokenResult()
              onSignUpSuccess(user, tokenResult)
            }
          })
        }

        return issuesPromise
      }),

    deleteUser: () => {
      return act(authSource, async () => {
        const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
        if (!firebaseUser || firebaseUser.isAnonymous) {
          return [
            {
              code: 'not-logged-in',
              message: 'You must be logged in to delete your account.',
            },
          ]
        }

        return convertFirebaseErrorsToIssues(
          async () => {
            await firebaseUser.delete()
          },
          {
            'requires-recent-login': 'requires-recent-login',
          },
        )
      })
    },

    reauthenticateWithPassword: async (data) => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'notLoggedIn',
            message: 'You must be logged in to reauthenticate.',
          },
        ]
      }

      return convertFirebaseErrorsToIssues<
        ReauthenticateWithPasswordRequest,
        ReauthenticateWithPasswordCodes
      >(
        async () => {
          await reauthenticateWithCredential(
            firebaseUser,
            EmailAuthProvider.credential(firebaseUser.email!, data.password),
          )
        },
        {
          'wrong-password': { password: 'mismatch' },
        },
      )
    },

    recoverEmail: async (data) => {
      return convertFirebaseErrorsToIssues(
        async () => {
          const actionCodeInfo = await checkActionCode(firebaseAuth, data.code)
          if (actionCodeInfo.operation !== 'RECOVER_EMAIL') {
            throw new Error('Action code type mismatch')
          }

          await applyActionCode(firebaseAuth, data.code)
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

    resetPassword: (data) => {
      return act(authSource, async () => {
        const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)

        return convertFirebaseErrorsToIssues(
          async () => {
            const email = await verifyPasswordResetCode(firebaseAuth, data.code)

            if (
              firebaseUser &&
              !firebaseUser.isAnonymous &&
              firebaseUser.email !== email
            ) {
              return [
                {
                  code: 'account-mismatch',
                  message:
                    "You're logged into a different account. Please log out before resetting your password.",
                },
              ]
            }

            await confirmPasswordReset(
              firebaseAuth,
              data.code,
              data.newPassword,
            )
            await signInWithCredential(
              firebaseAuth,
              EmailAuthProvider.credential(email, data.newPassword),
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

    sendEmailVerification: async (options) => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'not-logged-in',
            message: 'You must be logged in to resend your verification.',
          },
        ]
      }

      await sendEmailVerification(firebaseUser, options)

      return null
    },

    sendPasswordResetEmail: async (data, options) => {
      return convertFirebaseErrorsToIssues<
        SendPasswordResetEmailRequest,
        SendPasswordResetEmailCodes
      >(
        async () => {
          await sendPasswordResetEmail(firebaseAuth, data.email, options)
        },
        {
          'invalid-email': { email: 'invalid' },
          'user-not-found': { email: 'not-found' },
        },
      )
    },

    signInWithPassword: (request) =>
      act(authSource, () =>
        convertFirebaseErrorsToIssues<
          SignInWithPasswordRequest,
          SignInWithPasswordCodes
        >(
          async () => {
            await signInWithEmailAndPassword(
              firebaseAuth,
              request.email,
              request.password,
            )
          },
          {
            'invalid-email': { email: 'invalid' },
            'user-disabled': 'user-disabled',
            'user-not-found': { email: 'not-found' },
            'wrong-password': { password: 'mismatch' },
          },
        ),
      ).then(async (issues) => {
        // Wait until authSource has updated before emitting onSignInSuccess
        if (issues === null && onSignInSuccess) {
          const auth = await getSnapshotPromise(authSource)
          if (auth.user?.mutableFirebaseUser) {
            const tokenResult =
              await auth.user.mutableFirebaseUser.getIdTokenResult()
            onSignInSuccess(auth.user, tokenResult)
          }
        }

        return issues
      }),

    // signInWithRedirect(provider) {
    //   auth.signInWithRedirect(provider)
    // },

    signOut: async () => {
      // *Don't* wrap with act, as we want to see the intermediate states (so
      // that we get an immediate change in the UI).
      //
      // *Do* keep track of the fact that we're signing out, so that we can
      // ignore any updates that Firebase makes while this is occuring (as
      // Firebase can emit a new user on load *after* signOut has already been
      // called).
      signOutDepth++
      try {
        sessionStorage.clear()
        await firebaseAuth.signOut()
      } finally {
        signOutDepth--
      }
    },

    updateEmail: async (data) => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'not-logged-in',
            message: 'You must be logged in to resend your verification.',
          },
        ]
      }

      return act(authSource, async () => {
        return convertFirebaseErrorsToIssues(
          async () => {
            await updateEmail(firebaseUser, data.newEmail)
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

    updatePassword: async (data) => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'notLoggedIn',
            message: 'You must be logged in to resend your verification.',
          },
        ]
      }

      return act(authSource, async () => {
        return convertFirebaseErrorsToIssues<
          UpdatePasswordRequest,
          UpdatePasswordCodes
        >(
          async () => {
            const issues = await authController.reauthenticateWithPassword({
              password: data.password,
            })

            if (issues) {
              return issues
            }

            // TODO:
            // if the user curerntly has no password, e.g. due to signing in with facebook,
            // - user.linkWithCredential(firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, 'password'))
            await updatePassword(firebaseUser, data.newPassword)
            incrementUserVersion()
          },
          {
            'weak-password': { password: 'weak' },
            'requires-recent-login': 'requiresRecentLogin',
          },
        )
      })
    },

    updateProfile: async (data) => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'not-logged-in',
            message: 'You must be logged in to resend your verification.',
          },
        ]
      }

      return act(authSource, async () => {
        // Not calling convertErrorsToIssues, as there are no known errors.
        await updateProfile(firebaseUser, data)
        incrementUserVersion()
        return null
      })
    },

    verifyEmail: (data) => {
      return convertFirebaseErrorsToIssues(
        async () => {
          const actionCodeInfo = await checkActionCode(firebaseAuth, data.code)
          if (actionCodeInfo.operation !== 'VERIFY_EMAIL') {
            throw new Error('Action code type mismatch')
          }

          await applyActionCode(firebaseAuth, data.code)
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

  return [
    reduceVector(
      authSource,
      (latest, current) => (current.length ? current : latest),
      [] as AuthSnapshot[],
    ),
    authController,
  ]
}
