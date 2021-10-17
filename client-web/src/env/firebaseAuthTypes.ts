import firebase from 'firebase/app'
import { IssueCodes, Root, ValidatorIssues } from 'retil-issues'
import { Source } from 'retil-source'

// TODO: create individual issues objects for each possible request
export type PlaceholderIssues = ValidatorIssues<any>

export interface FirebaseSignInWithPasswordRequest {
  email: string
  password: string
}

export type FirebaseSignInWithPasswordCodes = {
  [Root]: 'error'
  email: 'missing' | 'invalid'
  password: 'missing' | 'invalid' | 'mismatch'
}

export type FirebaseSignInWithPasswordIssues = ValidatorIssues<
  FirebaseSignInWithPasswordRequest,
  FirebaseSignInWithPasswordCodes
>

export type FirebaseAuthService = readonly [
  FirebaseAuthSource,
  FirebaseAuthController,
]

export interface FirebaseAuthOptions {
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

  /**
   * Called whenever a user is authenticated, including after login and
   * registration, and also when a user is first authenticated after hydration.
   */
  onAuthenticated?: (
    user: FirebaseAuthUser,
    tokenResult: firebase.auth.IdTokenResult,
  ) => void

  onSignInSuccess?: (
    user: FirebaseAuthUser,
    tokenResult: firebase.auth.IdTokenResult,
  ) => void

  onSignUpFailure?: () => void
  onSignUpSuccess?: (
    user: FirebaseAuthUser,
    tokenResult: firebase.auth.IdTokenResult,
  ) => void

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
  // onSignInFailure?: () => void

  // onSignUpAttempt?: () => void

  // onSignOut?: (user: FirebaseAuthUser) => void
}

export type FirebaseAuthSource = Source<FirebaseAuthSnapshot>

export interface FirebaseAuthSnapshot {
  message: FirebaseAuthMessage | null
  user: FirebaseAuthUser | null
}

export interface FirebaseAuthUser {
  id: string

  claims: Record<string, any>

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

  /**
   * This contains the actual firebase user object, which may update without
   * causing a new value to be emitted.
   **/
  mutableFirebaseUser: firebase.User

  /**
   * This is a getter function instead of a value, as the "current" value isn't
   * as meaningful as the value at the specific point in time when it is needed.
   * Thus changes in the "current" value should never result in any UI updates,
   * except when changing to null, in which case we'll null out the function
   * itself.
   */
  getTokenInfo: FirebaseTokenInfoGetter
}

export type FirebaseTokenInfoGetter = (
  forceRefresh?: boolean,
) => Promise<firebase.auth.IdTokenResult | null>

export interface FirebaseAuthMessage {
  code: FirebaseAuthMessageCode
  data: object
  message: string
}

export type FirebaseAuthMessageCode = 'redirect-login-error'

export interface FirebaseCreateUserWithPasswordCodes extends IssueCodes {
  email: 'missing' | 'invalid' | 'taken'
  password: 'missing' | 'invalid' | 'weak'
  displayName: 'missing'
}

export interface FirebaseCreateUserWithPasswordRequest {
  email: string
  password: string
  displayName: string | null
  photoURL?: string | null
}

export interface FirebaseAuthProfile {
  displayName: string | null
  photoURL: string | null
}

export interface FirebaseAuthController {
  /**
   * Can be called before applying a code, to check whether it is still valid.
   */
  checkCode(data: { code: string }): Promise<null | PlaceholderIssues>

  clearMessage(): void

  createUserWithPassword(
    data: FirebaseCreateUserWithPasswordRequest,
  ): Promise<null | PlaceholderIssues>

  deleteUser(): Promise<null | PlaceholderIssues>

  // // doesn't update state
  // // https://firebase.google.com/docs/auth/web/account-linking
  // // - firebase: user.linkWithRedirect
  // linkWithRedirect(provider: AuthProvider): void

  reauthenticateWithPassword(data: {
    password: string
  }): Promise<null | PlaceholderIssues>

  recoverEmail(data: { code: string }): Promise<null | PlaceholderIssues>

  resetPassword(data: {
    code: string
    newPassword: string
  }): Promise<null | PlaceholderIssues>

  // // - firebase: user.reauthenticateWithRedirect
  // reauthenticateWithRedirect(provider: AuthProvider): void

  sendEmailVerification(options?: {
    url: string
  }): Promise<null | PlaceholderIssues>

  sendPasswordResetEmail(
    data: { email: string },
    options?: {
      // a URL to continue to after resetting the email
      url: string
    },
  ): Promise<null | PlaceholderIssues>

  // Useful for account creation processes, where you'd like to ensure a user
  // record is created in your database with the correct id *before* creating
  // an auth record -- preventing issues where closing the browser in the middle
  // of the account creation process results in orpahned auth records.
  signInAnonymously(): Promise<void>

  signInWithPassword(
    data: FirebaseSignInWithPasswordRequest,
  ): Promise<null | FirebaseSignInWithPasswordIssues>

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

  updateEmail(data: { newEmail: string }): Promise<null | PlaceholderIssues>

  updatePassword(data: {
    newPassword: string
  }): Promise<null | PlaceholderIssues>

  updateProfile(
    data: Partial<FirebaseAuthProfile>,
  ): Promise<null | PlaceholderIssues>

  verifyEmail(data: { code: string }): Promise<null | PlaceholderIssues>
}
