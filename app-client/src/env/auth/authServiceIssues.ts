import {
  CodesByPath,
  IssuePath,
  Validator,
  ValidatorIssues,
} from 'retil-issues'

import {
  SignInWithPasswordRequest,
  SignInWithPasswordCodes,
  CreateUserWithPasswordRequest,
  CreateUserWithPasswordCodes,
  SendPasswordResetEmailRequest,
  SendPasswordResetEmailCodes,
  UpdatePasswordRequest,
  UpdatePasswordCodes,
} from './authServiceTypes'

const validatePresence = (maybeValue?: string | null) => [
  !maybeValue && ('missing' as const),
]

const validateEmail = (maybeEmail?: string | null) => [
  !maybeEmail && ('missing' as const),
  !!maybeEmail && !/^.+@.+\..+$/.test(maybeEmail) && ('invalid' as const),
]

export const validateCreateUserWithPasswordRequest: Validator<
  CreateUserWithPasswordRequest,
  CreateUserWithPasswordCodes
> = (value) => ({
  email: validateEmail(value.email),
  password: validatePresence(value.password),
  displayName: validatePresence(value.displayName),
})

export const validateSendPasswordResetEmailRequest: Validator<
  SendPasswordResetEmailRequest,
  SendPasswordResetEmailCodes
> = (value) => ({
  email: validateEmail(value.email),
})

export const validateSignInWithPasswordRequest: Validator<
  SignInWithPasswordRequest,
  SignInWithPasswordCodes
> = (value) => ({
  email: validateEmail(value.email),
  password: validatePresence(value.password),
})

export const validateUpdatePasswordRequest: Validator<
  UpdatePasswordRequest,
  UpdatePasswordCodes
> = (value) => ({
  password: validatePresence(value.password),
  newPassword: validatePresence(value.newPassword),
})

export async function convertFirebaseErrorsToIssues<
  Value extends object,
  Codes extends CodesByPath<Value> = CodesByPath<Value>,
  Path extends IssuePath<Codes> = IssuePath<Codes>,
>(
  fn: Function,
  codeMap: {
    [code: string]: string | { [path: string]: string }
  },
): Promise<null | ValidatorIssues<Value, Codes, Path>> {
  const issueCodes = Object.keys(codeMap)

  try {
    await fn()
    return null
  } catch (error: any) {
    const code = error.code && error.code.replace('auth/', '')
    if (code && issueCodes.includes(code)) {
      return buildIssueFromError(codeMap[code], error)
    } else {
      console.error('Firebase returned unknown error:', error)
      return [
        {
          code: 'error',
          message: error.message,
        },
      ]
    }
  }
}

function buildIssueFromError(
  issue: string | { [path: string]: string },
  error: any,
): ValidatorIssues<any> {
  if (typeof issue === 'string') {
    return [
      {
        code: issue,
        message: error.message,
      },
    ]
  } else {
    const path = Object.keys(issue)[0]
    return {
      [path]: buildIssueFromError(issue[path], error),
    } as ValidatorIssues<any>
  }
}
