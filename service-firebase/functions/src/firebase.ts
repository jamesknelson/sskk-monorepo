import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp({
  ...functions.config().firebase,
  serviceAccountId: functions.config().service_account.id,
})

export const auth = admin.auth()

export const config = functions.config()

export const db = admin.firestore()
export const customerCollection = db.collection('customers')

export const logger = functions.logger
