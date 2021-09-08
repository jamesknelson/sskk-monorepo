import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// We need to import our firebase configuation before anything else, as
// otherwise it will not be available in any module-scope code.
import './firebase'

import { setAppCustomClaims } from './utils/claims'
import cors from './utils/cors'
import { createOrGetCustomerId, deleteCustomerByUID } from './utils/customers'

export const handleUserCreation = functions.auth
  .user()
  .onCreate(async (authUser) => {
    const isAnonymous = authUser.providerData.length === 0
    if (!isAnonymous) {
      const customerId = await createOrGetCustomerId(authUser)
      await setAppCustomClaims(authUser.uid, customerId)
    }
  })

export const processUserDeletion = functions.auth
  .user()
  .onDelete(async (authUser) => {
    await deleteCustomerByUID(authUser.uid)
  })

export const refreshCustomerToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      let token!: string
      try {
        ;({ token } = JSON.parse(req.body) || {})
      } catch {}
      if (!token) {
        res.status(400).send()
        return
      }

      const { uid } = await admin.auth().verifyIdToken(token)
      const authUser = await admin.auth().getUser(uid)
      const customerId = await createOrGetCustomerId(authUser)
      await setAppCustomClaims(authUser.uid, customerId)

      res.status(200).send()
    } catch (error) {
      functions.logger.error('error refreshing customer token', error)
      res.status(400).send(error)
    }
  })
})
