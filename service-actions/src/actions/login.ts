import { randomUUID } from 'crypto'
import { lookup as lookupReturningCallback } from 'dns'
import type { RequestHandler } from 'express'
import { promisify } from 'util'

import { actionSecret } from '../config'
import {
  InsertLoginDocument,
  InsertLoginWithTokenDocument,
  InsertLoginWithTokenMutation,
  LoginOutput,
  Mutation_RootLoginArgs as LoginArgs,
} from '../generated/graphql'
import { gqlFetch } from '../utils/gqlFetch'

const agentIdCookieName = 'letterAgentId'
const lookup = promisify(lookupReturningCallback)

interface ActionBody<Input> {
  session_variables: {
    'x-hasura-allowed-roles': string[]
    'x-hasura-auth-time'?: number
    'x-hasura-default-role': string
    'x-hasura-customer-id'?: string
  }
  input: Input
  action: { name: string }
}

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const secret = req.headers['action-secret'] as string
    const forwardedFor = req.headers['x-forwarded-for'] as string
    const host = req.headers['x-forwarded-host'] as string
    const referer = req.headers['referer'] as string
    const userAgent = req.headers['x-forwarded-user-agent'] as string

    const {
      session_variables,
      input,
      action: { name: action },
    } = req.body as ActionBody<LoginArgs>

    if (action !== 'login' || secret !== actionSecret) {
      return res.sendStatus(400)
    }

    // TODO
    // - if there's an auth token, pull custid & authtime out of session
    //   variable using claims_map
    //   see: https://hasura.io/blog/turn-your-node-js-rest-api-to-graphql/
    const authTime = session_variables['x-hasura-auth-time']
    const customerId = session_variables['x-hasura-customer-id']

    const ipAddress = forwardedFor
      ? forwardedFor.split(',')[0]
      : host && (await lookup(host.split(':')[0])).address

    const agentId =
      (req.signedCookies.agentId as string | undefined) || randomUUID()

    const loginVariables = {
      user_agent: userAgent,
      referrer_source: input.referrer_source || null,
      referrer_code: input.referrer_code || null,
      ip_address: ipAddress,
      url: referer,
      agent_id: agentId,
    }

    const result = await (authTime && customerId
      ? gqlFetch(InsertLoginWithTokenDocument, {
          ...loginVariables,
          auth_time: authTime,
          customer_id: customerId,
        })
      : (gqlFetch(
          InsertLoginDocument,
          loginVariables,
        ) as Promise<InsertLoginWithTokenMutation>))

    res.cookie(agentIdCookieName, agentId, {
      httpOnly: true,
      maxAge: 2147483647, // largest 32-bit number allowed
      secure: true,
      signed: true,
    })

    const output: Partial<LoginOutput> = {
      id: result.insert_logins_one?.id,
      created_at: result.insert_logins_one?.created_at,
      customer_id:
        result.insert_logins_one?.firebase_token?.customer_id || null,
    }

    return res.json(output)
  } catch (error) {
    next(error)
  }
}

export default loginHandler
