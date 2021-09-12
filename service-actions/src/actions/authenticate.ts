import { parse } from 'cookie'
import { signedCookies } from 'cookie-parser'
import { randomBytes as randomBytesReturningCallback, randomUUID } from 'crypto'
import { lookup as lookupReturningCallback } from 'dns'
import type { RequestHandler } from 'express'
import admin from 'firebase-admin'
import { promisify } from 'util'

import {
  browserOrDeviceIdCookieName,
  cookieSigningSecret,
  loginOperationName,
  ssrSecret,
} from '../config'
import {
  GetSessionDocument,
  InsertSessionDocument,
  InsertSessionAsCustomerDocument,
  InsertSessionAsCustomerMutation,
} from '../generated/graphql'
import { AuthenticationBody, Role, SessionVariables } from '../types'
import { gqlFetch } from '../utils/gqlFetch'

const lookup = promisify(lookupReturningCallback)
const randomBytes = promisify(randomBytesReturningCallback)

const bearerPattern = /^Bearer (.*)$/

const authenticateHandler: RequestHandler = async (req, res, next) => {
  try {
    const {
      headers: caseSensitiveHeaders,
      request: { operationName },
    } = req.body as AuthenticationBody

    const headers = {} as Record<string, string | undefined>
    for (const [caseSensitiveHeader, value] of Object.entries(
      caseSensitiveHeaders,
    )) {
      headers[caseSensitiveHeader.toLowerCase()] = value
    }

    const authorizationHeader = headers['authorization']
    const sessionTokenHeader = headers['x-sskk-session']
    const referrerCodeHeader = headers['x-sskk-referrer-code']
    const referrerSourceHeader = headers['x-sskk-referrer-source']
    const ssrSecretHeader = headers['x-sskk-ssr']
    const requestedRoleHeader = headers['x-hasura-role']
    const forwardedForHeader = headers['x-forwarded-for']
    const hostHeader = headers['host']
    const userAgentHeader = headers['user-agent']
    const refererHeader = headers['referer']
    const cookieHeader = headers['cookie']
    const cookies = cookieHeader
      ? signedCookies(parse(cookieHeader), cookieSigningSecret)
      : {}

    const hasSSRSecret = ssrSecretHeader === ssrSecret
    if (hasSSRSecret) {
      // With the SSR secret, we'll provide anonymous priveleges without any
      // rate limiting.
      const sessionVariables = {
        'x-hasura-role': 'anonymous-via-ssr',
      }
      return res.json(sessionVariables)
    }

    const match =
      authorizationHeader && authorizationHeader.match(bearerPattern)
    const bearerToken = match && match[1]

    const browserOrDeviceId =
      (cookies[browserOrDeviceIdCookieName] as string | undefined) ||
      randomUUID()
    const sessionVariablesWithoutRole: Omit<SessionVariables, 'x-hasura-role'> =
      {
        'x-hasura-browser-or-device-id': browserOrDeviceId,
      }
    const availableRoles: Role[] = ['anonymous']

    let firebaseToken: { auth_time: string; customer_id: string } | null = null
    if (bearerToken) {
      let decodedToken: admin.auth.DecodedIdToken | undefined
      try {
        decodedToken = await admin.auth().verifyIdToken(bearerToken)
      } catch (error: any) {
        console.error('Error verifying Firebase token', error.message)
        return res.sendStatus(401)
      }

      const customerId = decodedToken['customer_id']
      if (!customerId) {
        console.error('Firebase token is missing customer_id field.')
        return res.sendStatus(400)
      }

      firebaseToken = {
        auth_time: JSON.stringify(new Date(decodedToken.auth_time * 1000)),
        customer_id: customerId,
      }
    }

    if (operationName === loginOperationName) {
      if (!userAgentHeader || !firebaseToken) {
        return res.sendStatus(400)
      }

      const tokenBufferPromise = randomBytes(48)
      const ipAddress = forwardedForHeader
        ? forwardedForHeader.split(',')[0]
        : hostHeader && (await lookup(hostHeader.split(':')[0])).address

      const tokenBuffer = await tokenBufferPromise
      const token = tokenBuffer.toString('hex')

      const loginVariables = {
        browser_or_device_id: browserOrDeviceId,
        ip_address: ipAddress,
        referrer_source: referrerSourceHeader || null,
        referrer_code: referrerCodeHeader || null,
        token,
        user_agent: userAgentHeader,
        url: refererHeader,
      }

      let result: InsertSessionAsCustomerMutation
      try {
        result = await (!!firebaseToken
          ? gqlFetch(InsertSessionAsCustomerDocument, {
              ...loginVariables,
              ...firebaseToken,
            })
          : (gqlFetch(
              InsertSessionDocument,
              loginVariables,
            ) as Promise<InsertSessionAsCustomerMutation>))
      } catch (e) {
        console.error('Error inserting session', e, loginVariables)
        // Either the db is down, or the user is trying to login against a
        // revoked firebase token.
        return res.sendStatus(401)
      }

      if (!result.insert_sessions_one) {
        return res.sendStatus(500)
      }

      const { id: sessionId, firebase_token } = result.insert_sessions_one

      availableRoles.push('identified')
      sessionVariablesWithoutRole['x-hasura-session-id'] = sessionId
      sessionVariablesWithoutRole['x-hasura-session-token'] = token

      if (firebase_token?.customer_id) {
        availableRoles.push('customer')
        sessionVariablesWithoutRole['x-hasura-customer-id'] =
          firebase_token.customer_id
      }
    } else if (sessionTokenHeader) {
      const customerId = firebaseToken?.customer_id || null
      const {
        sessions: [session],
      } = await gqlFetch(GetSessionDocument, {
        session_token: sessionTokenHeader,
        customer_id: customerId,
      })

      if (!session || session.customer_id !== customerId) {
        return res.sendStatus(401)
      }

      // Note: we don't want to add the token to the response, as this should
      // only ever be returned once.
      availableRoles.push('identified')
      sessionVariablesWithoutRole['x-hasura-session-id'] = session.id

      if (customerId) {
        availableRoles.push('customer')
        sessionVariablesWithoutRole['x-hasura-customer-id'] = customerId
      }
    }

    const requestedRole =
      (requestedRoleHeader as Role | undefined) || 'anonymous'
    if (availableRoles.includes(requestedRole)) {
      return res.json({
        'x-hasura-role': requestedRole,
        ...sessionVariablesWithoutRole,
      })
    } else {
      return res.sendStatus(401)
    }
  } catch (error) {
    next(error)
  }
}

export default authenticateHandler
