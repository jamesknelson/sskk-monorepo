import type * as admin from 'firebase-admin'

import { auth, customerCollection } from '../firebase'
import { createHasuraCustomer, deleteHasuraCustomer } from './hasura'

const hasuraCustomerIdKey = 'hasuraCustomerId'

export async function createOrGetCustomerId({
  uid,
  displayName,
  email,
}: admin.auth.UserRecord): Promise<string> {
  const firestoreCustomerRef = customerCollection.doc(uid)
  const firestoreCustomer = await firestoreCustomerRef.get()

  let hasuraCustomerId: string
  if (firestoreCustomer.exists) {
    hasuraCustomerId = firestoreCustomer.data()![hasuraCustomerIdKey]
  } else {
    if (!email) {
      throw new Error(
        `Cannot create user named "${displayName}" with no email; email is required for registration.`,
      )
    }

    try {
      hasuraCustomerId = await createHasuraCustomer({
        displayName,
        uid,
        unverifiedEmail: email,
      })
    } catch (error) {
      // There's no customer for this user, so we'll want to delete the user
      // in case it gets in the way of re-creation after a failure.
      await auth.deleteUser(uid)
      throw error
    }

    await firestoreCustomerRef.set({
      [hasuraCustomerIdKey]: hasuraCustomerId,
    })
  }

  return hasuraCustomerId
}

export async function deleteCustomerByUID(uid: string) {
  const customerRef = customerCollection.doc(uid)
  const customer = await customerRef.get()
  if (customer.exists) {
    customerRef.update({
      deletedAt: Date.now(),
    })

    await deleteHasuraCustomer(customer.data()![hasuraCustomerIdKey])
  }
}
