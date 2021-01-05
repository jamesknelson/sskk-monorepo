import { Issues } from 'types/issues'

export type FirebaseAuthIssues = Issues

export interface IssueCodeMap {
  [code: string]: string | IssueCodeMap
}

function buildIssueFromError(
  codeMap: string | IssueCodeMap,
  error: any,
): Issues {
  if (typeof codeMap === 'string') {
    return {
      codes: [codeMap],
      message: error.message,
    }
  } else {
    const path = Object.keys(codeMap)[0]
    return {
      fields: {
        [path]: buildIssueFromError(codeMap[path], error),
      },
    }
  }
}

export const convertErrorsToIssues = async (
  fn: Function,
  codeMap: IssueCodeMap,
): Promise<null | FirebaseAuthIssues> => {
  const issueCodes = Object.keys(codeMap)

  try {
    await fn()
    return null
  } catch (error) {
    const code = error.code && error.code.replace('auth/', '')
    if (code && issueCodes.includes(code)) {
      return buildIssueFromError(codeMap[code], error)
    } else {
      throw error
    }
  }
}
