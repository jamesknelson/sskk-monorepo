import * as admin from 'firebase-admin'

export async function setAppCustomClaims(uid: string, hasuraMemberId: string) {
  await admin.auth().setCustomUserClaims(uid, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['anonymous', 'member', 'editor'],
      'x-hasura-default-role': 'member',
      'x-hasura-member-id': hasuraMemberId,
    },
  })
}
