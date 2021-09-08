import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'

import { cookieSigningSecret } from './config'
import { createLazyHandler } from './utils/lazyHandler'

const lazy = createLazyHandler({
  // In production, Load router asap
  preload: process.env.NODE_ENV === 'production',
})

const app = express()

app.use(bodyParser.json())
app.use(cookieParser(cookieSigningSecret))

app.post(
  '/login',
  lazy(() => import('./actions/login')),
)

export default app
