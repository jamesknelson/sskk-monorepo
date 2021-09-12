import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import admin from 'firebase-admin'

import { cookieSigningSecret, firebaseServiceAccount } from './config'
import { createLazyHandler } from './utils/lazyHandler'

// Initialize the Firebase admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseServiceAccount)),
})

const lazy = createLazyHandler({
  // In production, Load router asap
  preload: process.env.NODE_ENV === 'production',
})

const app = express()

app.use(bodyParser.json())
app.use(cookieParser(cookieSigningSecret))

app.post(
  '/authenticate',
  lazy(() => import('./actions/authenticate')),
)

app.post(
  '/login',
  lazy(() => import('./actions/login')),
)

export default app
