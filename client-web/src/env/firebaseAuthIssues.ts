import { ValidatorIssues } from 'retil-issues'

export interface IssueCodeMap {
  [code: string]: string | IssueCodeMap
}

function buildIssueFromError(
  codeMap: string | IssueCodeMap,
  error: any,
): ValidatorIssues<any> {
  if (typeof codeMap === 'string') {
    return [
      {
        code: codeMap,
        message: error.message,
      },
    ]
  } else {
    const path = Object.keys(codeMap)[0]
    return {
      [path]: buildIssueFromError(codeMap[path], error),
    } as ValidatorIssues<any>
  }
}

export const convertErrorsToIssues = async (
  fn: Function,
  codeMap: IssueCodeMap,
): Promise<null | ValidatorIssues<any>> => {
  const issueCodes = Object.keys(codeMap)

  try {
    await fn()
    return null
  } catch (error: any) {
    const code = error.code && error.code.replace('auth/', '')
    if (code && issueCodes.includes(code)) {
      return buildIssueFromError(codeMap[code], error)
    } else {
      throw error
    }
  }
}