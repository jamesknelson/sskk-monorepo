import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as CORS from 'cors'
import fetch from 'node-fetch'

const corsConfig = functions.config().cors

const cors = CORS({
  ...corsConfig,
  origin: corsConfig.origin === '*' ? true : corsConfig.origin,
})

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()
const members = db.collection('members')

const InsertUserOnly = `
  mutation InsertUser($firebase_uid: String = "") {
    insert_members_one(object: {firebase_uid: $firebase_uid}) {
      id
    }
  }
`
const InsertUserAndProfile = `
  mutation InsertUserAndProfile($firebase_uid: String = "", $profile: profiles_insert_input!) {
    insert_members_one(object: {firebase_uid: $firebase_uid, profile: {data: $profile}}) {
      id
      profile_id
    }
  }
`

const updateUserClaims = async (user: admin.auth.UserRecord) => {
  const { uid, displayName: display_name, photoURL: avatar_url } = user
  const hasProfile = display_name || avatar_url

  const memberRef = members.doc(uid)
  const member = await memberRef.get()

  let memberId: string
  if (member.exists) {
    memberId = member.data()!.id
  } else {
    const token = await admin.auth().createCustomToken(uid, {
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['admin'],
        'x-hasura-default-role': 'admin',
      },
    })

    const query = JSON.stringify({
      query: hasProfile ? InsertUserAndProfile : InsertUserOnly,
      variables: {
        firebase_uid: uid,
        profile: hasProfile
          ? {
              display_name,
              avatar_url,
            }
          : undefined,
      },
    })

    const result = await fetch(functions.config().graphql.url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: query,
    })

    const { data } = await result.json()

    memberId = data.insert_members_one.id

    await memberRef.set({
      id: memberId,
    })
  }

  return admin.auth().setCustomUserClaims(uid, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['anonymous', 'member', 'editor'],
      'x-hasura-default-role': 'member',
      'x-hasura-user-id': memberId,
    },
  })
}

exports.handleUserCreation = functions.auth
  .user()
  .onCreate((user) => updateUserClaims(user))

exports.processUserDeletion = functions.auth.user().onDelete(async (user) => {
  const memberRef = members.doc(user.uid)
  const member = await memberRef.get()
  if (member.exists) {
    memberRef.update({
      deletedAt: Date.now(),
    })
  }
})

exports.refreshUserToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const uid = req.query.uid as string
      const user = await admin.auth().getUser(uid)
      await updateUserClaims(user)
      res.status(200).send()
    } catch (error) {
      console.error('refresh error', error)
      res.status(400).send(error)
    }
  })
})

exports.refreshAdminToken = functions.https.onRequest((req, res) => {
  // - check req to ensure the user has recently reauthenticated,
  //   or the user already has a non-expired admin token
  // - if the user currently has a recent user token (and not a
  //   non-expired admin token), then check with hasura that the
  //   user has a non-expired admin role
  // - use createCustomToken to create a custom token with 'admin'
  //   as an allowed role, that expires after 10 minutes
  //   see: https://firebase.google.com/docs/auth/admin/create-custom-tokens
})
