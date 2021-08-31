import * as admin from 'firebase-admin'

import { createHasuraMember, deleteHasuraMember } from './hasura'

const db = admin.firestore()
const memberCollection = db.collection('members')
const hasuraMemberIdKey = 'hasuraMemberId'

export async function createOrGetMemberId({
  uid,
  displayName,
  email,
  photoURL,
}: admin.auth.UserRecord): Promise<string> {
  const firestoreMemberRef = memberCollection.doc(uid)
  const firestoreMember = await firestoreMemberRef.get()

  let hasuraMemberId: string
  if (firestoreMember.exists) {
    hasuraMemberId = firestoreMember.data()![hasuraMemberIdKey]
  } else {
    if (!email) {
      throw new Error(
        `Cannot create user named "${displayName}" with no email; email is required for registration.`,
      )
    }

    try {
      hasuraMemberId = await createHasuraMember({
        displayName,
        photoURL,
        uid,
      })
    } catch (error) {
      // There's no member for this user, so we'll want to delete the user
      // in case it gets in the way of re-creation after a failure.
      await admin.auth().deleteUser(uid)
      throw error
    }

    await firestoreMemberRef.set({
      [hasuraMemberIdKey]: hasuraMemberId,
    })
  }

  return hasuraMemberId
}

export async function deleteMemberByUID(uid: string) {
  const memberRef = memberCollection.doc(uid)
  const member = await memberRef.get()
  if (member.exists) {
    memberRef.update({
      deletedAt: Date.now(),
    })

    await deleteHasuraMember(member.data()![hasuraMemberIdKey])
  }
}
