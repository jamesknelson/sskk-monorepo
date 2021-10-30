import firebase from 'firebase/app'
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

import { convertErrorsToIssues } from './firebaseAuthIssues'
import {
  FirebaseAuthController,
  FirebaseAuthMessage,
  FirebaseAuthOptions,
  FirebaseAuthService,
  FirebaseAuthSnapshot,
  FirebaseAuthUser,
  FirebaseSignInWithPasswordCodes,
  FirebaseSignInWithPasswordRequest,
  FirebaseTokenInfoGetter,
  // TODO: remove
  PlaceholderIssues,
} from './firebaseAuthTypes'

export function createFirebaseAuthService(
  options: FirebaseAuthOptions = {},
): FirebaseAuthService {
  const {
    firebaseAuth = firebase.auth(),
    languageCode = null,
    shouldRefreshToken,

    onAuthenticated,

    onSignInSuccess,

    onSignUpFailure,
    onSignUpSuccess,
  } = options

  firebaseAuth.languageCode = languageCode

  const getTokenInfoForUser = async (
    user: firebase.User | null,
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

  const mutableFirebaseUserSource = observe<firebase.User | null>(
    (next, error, complete) =>
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

  const authWithoutMessagesSource = fuse<Omit<FirebaseAuthSnapshot, 'message'>>(
    (use, _, memo) => {
      // Incrementing this source allows us to imperatively output a new auth
      // object, which is handy as some firebase methods do not cause a new
      // user object to be emitted by onAuthStateChanged.
      use(userVersionSource)

      const mutableFirebaseUser = use(mutableFirebaseUserSource)
      const claims = use(claimsSource)

      const getTokenInfo = memo(
        (
          mutableFirebaseUser: firebase.User | null,
        ): FirebaseTokenInfoGetter | null => {
          if (!mutableFirebaseUser) {
            return null
          } else {
            const getTokenInfo: FirebaseTokenInfoGetter = async (
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

      const user: FirebaseAuthUser | null = mutableFirebaseUser
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

  const authController: FirebaseAuthController = {
    checkCode: async (data): Promise<null | PlaceholderIssues> =>
      convertErrorsToIssues(() => firebaseAuth.checkActionCode(data.code), {
        'expired-action-code': { code: 'expired' },
        'invalid-action-code': { code: 'already-used' },
        'user-disabled': 'user-disabled',
        'user-not-found': 'user-not-found',
      }),

    clearMessage() {
      setMessage(null)
    },

    createUserWithPassword: async (data): Promise<null | PlaceholderIssues> =>
      act(authWithoutMessagesSource, async () => {
        const hasProfile = data.displayName || data.photoURL

        let firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
        if (firebaseUser && !firebaseUser.isAnonymous) {
          return [
            {
              code: 'already-logged-in',
              message:
                "You're already logged into an account! If you really want to create a new account, please log out of your existing account first.",
            },
          ]
        }

        const issuesPromise = convertErrorsToIssues(
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
                await firebaseAuth.createUserWithEmailAndPassword(
                  data.email,
                  data.password,
                )
              ).user!
            }

            // Don't bother waiting the email send to complete
            firebaseUser.sendEmailVerification()
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

    deleteUser: (): Promise<null | PlaceholderIssues> => {
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

    reauthenticateWithPassword: async (
      data,
    ): Promise<null | PlaceholderIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'not-logged-in',
            message: 'You must be logged in to delete your account.',
          },
        ]
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

    recoverEmail: async (data): Promise<null | PlaceholderIssues> => {
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

    resetPassword: (data): Promise<null | PlaceholderIssues> => {
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
              return [
                {
                  code: 'account-mismatch',
                  message:
                    "You're logged into a different account. Please log out before resetting your password.",
                },
              ]
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
    ): Promise<null | PlaceholderIssues> => {
      const firebaseUser = await getSnapshotPromise(mutableFirebaseUserSource)
      if (!firebaseUser || firebaseUser.isAnonymous) {
        return [
          {
            code: 'not-logged-in',
            message: 'You must be logged in to resend your verification.',
          },
        ]
      }

      await firebaseUser.sendEmailVerification(options)

      return null
    },

    sendPasswordResetEmail: async (
      data,
      options,
    ): Promise<null | PlaceholderIssues> => {
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

    signInWithPassword: (request) =>
      act(authSource, () =>
        convertErrorsToIssues<
          FirebaseSignInWithPasswordRequest,
          FirebaseSignInWithPasswordCodes
        >(
          async () => {
            await firebaseAuth.signInWithEmailAndPassword(
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

    updateEmail: async (data): Promise<null | PlaceholderIssues> => {
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

    updatePassword: async (data): Promise<null | PlaceholderIssues> => {
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

    updateProfile: async (data): Promise<null | PlaceholderIssues> => {
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
        await firebaseUser.updateProfile(data)
        incrementUserVersion()
        return null
      })
    },

    verifyEmail: (data): Promise<null | PlaceholderIssues> => {
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

  return [
    reduceVector(
      authSource,
      (latest, current) => (current.length ? current : latest),
      [] as FirebaseAuthSnapshot[],
    ),
    authController,
  ]
}
