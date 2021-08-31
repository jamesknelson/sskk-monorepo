import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import { setAppCustomClaims } from './utils/claims'
import cors from './utils/cors'
import { createOrGetMemberId, deleteMemberByUID } from './utils/members'

admin.initializeApp({
  ...functions.config().firebase,
  serviceAccountId: functions.config().service_account.id,
})

exports.handleUserCreation = functions.auth
  .user()
  .onCreate(async (authUser) => {
    const isAnonymous = authUser.providerData.length === 0
    if (!isAnonymous) {
      const memberId = await createOrGetMemberId(authUser)
      await setAppCustomClaims(authUser.uid, memberId)
    }
  })

exports.processUserDeletion = functions.auth
  .user()
  .onDelete(async (authUser) => {
    await deleteMemberByUID(authUser.uid)
  })

exports.refreshMemberToken = functions.https.onRequest((req, res) => {
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
      const memberId = await createOrGetMemberId(authUser)
      await setAppCustomClaims(authUser.uid, memberId)

      res.status(200).send()
    } catch (error) {
      functions.logger.error('error refreshing member token', error)
      res.status(400).send(error)
    }
  })
})
