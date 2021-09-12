export interface AuthenticationBody {
  headers: Record<string, string>
  request: {
    variables: Record<string, any>
    operationName: string
    query: string
  }
}

export type Role =
  // we don't know shit about the requester. all ssr requests are made
  // anonymously
  | 'anonymous'
  // we have an unrevoked record about the requester in the sessions table,
  // identified by an X-SSKK-Session header
  | 'identified'
  // we have identified the requester, and they've also provided an unrevoked
  // firebase token identifying a customer record
  | 'customer'
// TODO:
// // the requester is a customer who we've recevied up-to-date payments from
// | 'member'

export interface SessionVariables {
  'x-hasura-role': Role
  'x-hasura-browser-or-device-id'?: string
  'x-hasura-customer-id'?: string
  'x-hasura-session-id'?: string
  'x-hasura-session-token'?: string
}

export interface ActionBody<Input> {
  session_variables: SessionVariables
  input: Input
  action: { name: string }
}
