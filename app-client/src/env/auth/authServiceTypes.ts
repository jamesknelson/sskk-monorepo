import { IdTokenResult, User as FirebaseAuthUser } from 'firebase/auth'
import { ValidatorIssues } from 'retil-issues'
import { Source } from 'retil-source'
import { root } from 'retil-support'

export type AuthService = readonly [AuthSource, AuthController]

export type AuthSource = Source<AuthSnapshot>

export interface AuthSnapshot {
  message: AuthMessage | null
  user: AuthUser | null
}

export interface AuthUser {
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
  mutableFirebaseUser: FirebaseAuthUser

  /**
   * This is a getter function instead of a value, as the "current" value isn't
   * as meaningful as the value at the specific point in time when it is needed.
   * Thus changes in the "current" value should never result in any UI updates,
   * except when changing to null, in which case we'll null out the function
   * itself.
   */
  getTokenInfo: AuthTokenInfoGetter
}

export type AuthTokenInfoGetter = (
  forceRefresh?: boolean,
) => Promise<IdTokenResult | null>

export interface AuthMessage {
  code: AuthMessageCode
  data: object
  message: string
}

export type AuthMessageCode = 'redirect-login-error'

export interface AuthProfile {
  displayName: string | null
  photoURL: string | null
}

export interface AuthController {
  /**
   * Can be called before applying a code, to check whether it is still valid.
   */
  checkCode(data: { code: string }): Promise<null | ValidatorIssues<any>>

  clearMessage(): void

  createUserWithPassword(
    data: CreateUserWithPasswordRequest,
  ): Promise<null | ValidatorIssues<
    CreateUserWithPasswordRequest,
    CreateUserWithPasswordCodes
  >>

  deleteUser(): Promise<null | ValidatorIssues<any>>

  // // doesn't update state
  // // https://firebase.google.com/docs/auth/web/account-linking
  // // - firebase: user.linkWithRedirect
  // linkWithRedirect(provider: AuthProvider): void

  reauthenticateWithPassword(
    data: ReauthenticateWithPasswordRequest,
  ): Promise<null | ValidatorIssues<
    ReauthenticateWithPasswordRequest,
    ReauthenticateWithPasswordCodes
  >>

  recoverEmail(data: { code: string }): Promise<null | ValidatorIssues<any>>

  resetPassword(data: {
    code: string
    newPassword: string
  }): Promise<null | ValidatorIssues<any>>

  // // - firebase: user.reauthenticateWithRedirect
  // reauthenticateWithRedirect(provider: AuthProvider): void

  sendEmailVerification(options?: {
    url: string
  }): Promise<null | ValidatorIssues<any>>

  sendPasswordResetEmail(
    data: SendPasswordResetEmailRequest,
    options?: {
      // a URL to continue to after resetting the email
      url: string
    },
  ): Promise<null | ValidatorIssues<
    SendPasswordResetEmailRequest,
    SendPasswordResetEmailCodes
  >>

  signInWithPassword(
    data: SignInWithPasswordRequest,
  ): Promise<null | SignInWithPasswordIssues>

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

  updateEmail(data: { newEmail: string }): Promise<null | ValidatorIssues<any>>

  updatePassword(
    data: UpdatePasswordRequest,
  ): Promise<null | ValidatorIssues<UpdatePasswordRequest, UpdatePasswordCodes>>

  updateProfile(
    data: Partial<AuthProfile>,
  ): Promise<null | ValidatorIssues<any>>

  verifyEmail(data: { code: string }): Promise<null | ValidatorIssues<any>>
}

export interface CreateUserWithPasswordRequest {
  email: string
  password: string
  displayName: string | null
  photoURL?: string | null
}
export type CreateUserWithPasswordCodes = {
  [root]: 'error' | 'alreadyLoggedIn'
  email: 'missing' | 'invalid' | 'taken'
  password: 'missing' | 'weak'
  displayName: 'missing'
}

export interface ReauthenticateWithPasswordRequest {
  password: string
}
export type ReauthenticateWithPasswordCodes = {
  [root]: 'error' | 'notLoggedIn'
  password: 'missing' | 'mismatch'
}

export interface SendPasswordResetEmailRequest {
  email: string
}
export type SendPasswordResetEmailCodes = {
  [root]: 'error'
  email: 'missing' | 'invalid' | 'notFound'
}

export interface SignInWithPasswordRequest {
  email: string
  password: string
}
export type SignInWithPasswordCodes = {
  [root]: 'error'
  email: 'missing' | 'invalid'
  password: 'missing' | 'mismatch'
}
export type SignInWithPasswordIssues = ValidatorIssues<
  SignInWithPasswordRequest,
  SignInWithPasswordCodes
>

export interface UpdatePasswordRequest
  extends ReauthenticateWithPasswordRequest {
  newPassword: string
}
export type UpdatePasswordCodes = ReauthenticateWithPasswordCodes & {
  newPassword: 'missing' | 'weak'
}
