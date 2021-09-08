import { auth } from '../firebase'

export async function setAppCustomClaims(
  uid: string,
  hasuraCustomerId: string,
) {
  await auth.setCustomUserClaims(uid, {
    customer_id: hasuraCustomerId,
  })
}
