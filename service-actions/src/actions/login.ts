import type { RequestHandler } from 'express'

import {
  actionSecret,
  browserOrDeviceIdCookieName,
  inLocalDevelopment,
} from '../config'
import { LoginOutput } from '../generated/graphql'
import { ActionBody } from '../types'

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const secret = req.get('action-secret')

    const {
      session_variables,
      action: { name: action },
    } = req.body as ActionBody<{}>

    if (action !== 'login' || secret !== actionSecret) {
      return res.sendStatus(400)
    }

    const sessionToken = session_variables['x-hasura-session-token']
    const customerId = session_variables['x-hasura-customer-id']
    const browserOrDeviceId = session_variables['x-hasura-browser-or-device-id']

    const output: Partial<LoginOutput> = {
      customer_id: customerId || null,
      session_token: sessionToken,
    }

    res.cookie(browserOrDeviceIdCookieName, browserOrDeviceId, {
      httpOnly: true,
      maxAge: 2147483647, // largest 32-bit number allowed
      secure: !inLocalDevelopment,
      signed: true,
    })

    return res.json(output)
  } catch (error) {
    next(error)
  }
}

export default loginHandler
