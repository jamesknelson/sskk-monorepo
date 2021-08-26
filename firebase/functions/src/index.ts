import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as CORS from 'cors'
import fetch from 'node-fetch'

interface TrackerDevice {
  token: string
  navigator_user_agent: string
  navigator_languages: readonly string[]
}

interface TrackerEntry {
  referrer_code?: string
  entry_path: string
  entry_at: number
}

type Tracker = null | {
  device: TrackerDevice
  entries: TrackerEntry[]
}

const StaffRole = 'admin'
const StaffTokenTTL = 60 * 60 * 1000

const corsConfig = functions.config().cors
const graphqlConfig = functions.config().graphql
const sibConfig = functions.config().sib

const whitelist =
  corsConfig.origin === '*' ? true : corsConfig.origin.split(',')

const cors = CORS({
  methods: 'GET,POST',
  origin: (origin, callback) => {
    if (whitelist === true || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
})

admin.initializeApp({
  ...functions.config().firebase,
  serviceAccountId: functions.config().service_account.id,
})

const db = admin.firestore()
const users = db.collection('users')

const SelectUser = `
  query SelectUser($firebase_uid: String!) {
    users(where: {firebase_uid: { _eq: $firebase_uid }}) {
      id
      staff_until
    }
  }
`

const SelectReferrerCodes = `
  query SelectReferrerCodes($codes: [String!]!) {
    referrer_codes(where: {code: { _in: $codes }}) {
      id
      code
    }
  }
`

const InsertUserOnly = `
  mutation InsertUser($firebase_uid: String = "") {
    insert_users_one(object: {firebase_uid: $firebase_uid}) {
      id
    }
  }
`
const InsertUserAndProfile = `
  mutation InsertUserAndProfile($firebase_uid: String!, $avatar_url: String, $display_name: String) {
    insert_profiles_one(object: {user: {data: {firebase_uid: $firebase_uid}}, display_name: $display_name, avatar_url: $avatar_url}) {
      id
      user {
        id
      }
    }
  }
`

const InsertLogin = `
  mutation InsertLogin(
    $auth_time: bigint!
    $email: String!
    $ip: inet!
    $user_id: uuid!
    $navigator_languages: _text!
    $navigator_user_agent: String!
    $device_token: String!
    $entries: [entries_insert_input!]!
  ) {
    insert_logins_one(
      object: {
        auth_time: $auth_time
        email: $email
        ip: $ip
        user_id: $user_id
        device: {
          data: {
            navigator_languages: $navigator_languages
            navigator_user_agent: $navigator_user_agent
            token: $device_token
          }
          on_conflict: { constraint: devices_token_key, update_columns: [token] }
        }
        entries: {
          data: $entries
        }
      }
      on_conflict: { constraint: logins_constraint, update_columns: [auth_time] }
    ) {
      id
    }
  }
`

const DeleteUser = `
  mutation DeleteUser($user_id: uuid!) {
    delete_users_by_pk(id: $user_id) {
      id
    }
  }
`

async function deleteMember(userId: string): Promise<void> {
  const query = JSON.stringify({
    query: DeleteUser,
    variables: {
      user_id: userId,
    },
  })

  await fetch(graphqlConfig.url, {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': graphqlConfig.admin_secret,
    },
    method: 'POST',
    body: query,
  })
}

interface CreateMemberOptions {
  displayName?: string
  photoURL?: string
  uid: string
}

async function createMember({
  displayName,
  photoURL,
  uid,
}: CreateMemberOptions): Promise<string> {
  const hasProfile = displayName || photoURL

  const variables: Record<string, string> = {
    firebase_uid: uid,
  }
  if (displayName) {
    variables['display_name'] = displayName
  }
  if (photoURL) {
    variables['avatar_url'] = photoURL
  }
  const query = JSON.stringify({
    query: hasProfile ? InsertUserAndProfile : InsertUserOnly,
    variables,
  })

  const result = await fetch(graphqlConfig.url, {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': graphqlConfig.admin_secret,
    },
    method: 'POST',
    body: query,
  })
  const { data } = await result.json()

  const hasuraUserId =
    data?.insert_profiles_one?.user?.id || data?.insert_users_one?.id

  if (!hasuraUserId) {
    throw new Error(data.error)
  }

  return hasuraUserId
}

async function deleteSIBContact(id: number) {
  if (sibConfig.key !== 'test') {
    await fetch(`https://api.sendinblue.com/v3/contacts/${id}`, {
      headers: {
        accept: 'application/json',
        'api-key': sibConfig.key,
      },
      method: 'DELETE',
    })
  }
}

interface CreateSIBContactOptions {
  displayName?: string
  email: string
  hasuraUserId: string
  uid: string
}

async function createSIBContact({
  displayName,
  email,
  hasuraUserId,
  uid,
}: CreateSIBContactOptions): Promise<number | null> {
  if (sibConfig.key === 'test') {
    return null
  }

  const result = await fetch('https://api.sendinblue.com/v3/contacts', {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': sibConfig.key,
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      attributes: {
        NAME: displayName,
        GLOBIFY_USER_ID: hasuraUserId,
        FIREBASE_UID: uid,
      },
      listIds: [parseInt(sibConfig.list_id)],
    }),
  })

  const data = await result.json()
  const id = data?.id

  if (!id) {
    throw new Error(`Unable to create Send In Blue contact for "${email}".`)
  }

  return id
}

const createUser = async (
  firebaseUser: admin.auth.UserRecord,
  userRef: FirebaseFirestore.DocumentReference,
): Promise<string> => {
  const { uid, displayName, email, photoURL } = firebaseUser

  if (!email) {
    throw new Error(
      `Cannot create user named "${displayName}" with no email; email is required for registration.`,
    )
  }

  let hasuraUserId: string
  let sibContactId: number | null

  try {
    hasuraUserId = await createMember({
      displayName,
      photoURL,
      uid,
    })
  } catch (error) {
    await admin.auth().deleteUser(uid)
    throw error
  }

  try {
    sibContactId = await createSIBContact({
      displayName,
      email,
      hasuraUserId,
      uid,
    })
  } catch (error) {
    try {
      deleteMember(hasuraUserId)
    } catch {}

    await admin.auth().deleteUser(uid)
    throw error
  }

  await userRef.set(
    {
      id: hasuraUserId,
      sibContactId,
    },
    { merge: true },
  )

  return hasuraUserId
}

const updateUserClaims = async (firebaseUser: admin.auth.UserRecord) => {
  const { uid, providerData } = firebaseUser

  // Do not create user records for anonymous users
  if (providerData.length === 0) {
    return
  }

  const userRef = users.doc(uid)
  const user = await userRef.get()

  const userId: string = user.exists
    ? user.data()!.id
    : await createUser(firebaseUser, userRef)

  await admin.auth().setCustomUserClaims(uid, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['anonymous', 'member', 'editor'],
      'x-hasura-default-role': 'member',
      'x-hasura-user-id': memberId,
    },
  })

  return userId
}

// This function is required as hasura is currently unable to accept an array
// of strings for functions that accept text arrays, and instead requires an
// array literal to be passed in directly.
export function convertArrayToPostgresLiteral(
  strings: readonly string[],
): string {
  return `{${strings.join(',')}}`
}

async function createLoginRecordsIfRequired(
  user_id: string,
  ip: string,
  email: string,
  auth_time: number,
  trackerDevice: TrackerDevice,
  entryInputsPromise: Promise<EntryInput[]>,
) {
  const entries = await entryInputsPromise
  const variables = {
    auth_time,
    email,
    ip: ip || '127.0.0.1',
    user_id,
    navigator_languages: convertArrayToPostgresLiteral(
      trackerDevice.navigator_languages,
    ),
    navigator_user_agent: trackerDevice.navigator_user_agent,
    device_token: trackerDevice.token,
    entries,
  }
  const loginQuery = JSON.stringify({
    query: InsertLogin,
    variables,
  })

  // No need to wait for a result here
  const response = await fetch(graphqlConfig.url, {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': graphqlConfig.admin_secret,
    },
    method: 'POST',
    body: loginQuery,
  })
  const body = await response.json()

  if (body.error) {
    functions.logger.error('Error creating user entry', body)
  }
}

exports.handleUserCreation = functions.auth.user().onCreate((user) => {
  return updateUserClaims(user)
})

exports.processUserDeletion = functions.auth.user().onDelete(async (user) => {
  const memberRef = members.doc(user.uid)
  const member = await memberRef.get()
  if (member.exists) {
    memberRef.update({
      deletedAt: Date.now(),
    })
  }
})

exports.track = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    let token!: string
    let tracker!: Tracker
    try {
      ;({ token, tracker } = JSON.parse(req.body) || {})
    } catch {
      return res.status(400).send()
    }

    if (!token || !tracker) {
      return res.status(400).send()
    }

    const entryInputsPromise = getValidEntryInputs(tracker.entries)

    let tokenDetails!: admin.auth.DecodedIdToken
    try {
      tokenDetails = await admin.auth().verifyIdToken(token)
    } catch {
      return res.status(401).send()
    }

    const { uid, auth_time } = tokenDetails
    const { providerData, email } = await admin.auth().getUser(uid)

    // Do not record logins for anonymous users
    if (providerData.length === 0) {
      return res.status(403).send()
    }

    const firestoreUserRef = users.doc(uid)
    const firestoreUser = await firestoreUserRef.get()
    let hasuraUserId: string = firestoreUser.data()!.id

    await createLoginRecordsIfRequired(
      hasuraUserId,
      req.ip,
      email!,
      auth_time,
      tracker.device,
      entryInputsPromise,
    )

    return res.status(200).send()
  })
})

interface EntryInput {
  entry_at: string
  entry_path: string
  referrer_code_id?: string
}

async function getValidEntryInputs(
  trackerEntries: TrackerEntry[],
): Promise<EntryInput[]> {
  const validTrackerEntries = trackerEntries.filter(
    (referral) =>
      typeof referral?.entry_at === 'number' &&
      typeof referral?.entry_path === 'string',
  )

  if (!validTrackerEntries.length) {
    return []
  }

  const queryReferrerCodes = validTrackerEntries
    .map((referral) => referral.referrer_code)
    .filter(Boolean)

  let codeIdMap = new Map<string, string>()

  if (queryReferrerCodes.length) {
    const result = await fetch(graphqlConfig.url, {
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': graphqlConfig.admin_secret,
      },
      method: 'POST',
      body: JSON.stringify({
        query: SelectReferrerCodes,
        variables: {
          codes: queryReferrerCodes,
        },
      }),
    })
    const { data, error } = await result.json()

    if (error) {
      functions.logger.error(
        'Error fetching referral codes from hasura:',
        error,
      )
      throw error
    }

    codeIdMap = new Map<string, string>(
      data.referrer_codes.map(({ id, code }: any) => [code, id]),
    )
  }

  const referralInputs = validTrackerEntries.map((referral) => ({
    entry_at: convertJSTimestampToDateString(referral.entry_at),
    entry_path: referral.entry_path,
    referrer_code_id:
      referral.referrer_code && codeIdMap.get(referral.referrer_code)!,
  }))

  return referralInputs
}

function convertJSTimestampToDateString(timestamp: number) {
  return JSON.stringify(new Date(timestamp))
}

exports.refreshUserToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      let token = req.query.token as string
      let tracker: Tracker | undefined
      if (req.body) {
        try {
          ;({ token, tracker } = JSON.parse(req.body) || {})
        } catch {
          res.status(400).send()
          return
        }
      }

      if (!token) {
        res.status(400).send()
      } else {
        const entryInputsPromise =
          tracker && getValidEntryInputs(tracker.entries)

        const { auth_time, uid, email } = await admin
          .auth()
          .verifyIdToken(token)
        const user = await admin.auth().getUser(uid)

        const hasuraUserId = await updateUserClaims(user)

        if (hasuraUserId && tracker && entryInputsPromise) {
          // This is safe to run even if the login has already been created, as
          // only a single login record can be created per user for each login.
          createLoginRecordsIfRequired(
            hasuraUserId,
            req.ip,
            email!,
            auth_time,
            tracker?.device,
            entryInputsPromise,
          ).catch((error) => {
            // Catch errors here as we don't want a tracking failure to get in
            // the way of actually allowing the user to log in.
            functions.logger.error(
              `Error creating login record for user "${hasuraUserId}". Device:`,
              tracker,
              '\nError: ',
              error,
            )
          })
        }

        res.status(200).send()
      }
    } catch (error) {
      functions.logger.error('refresh user token error', error)
      res.status(400).send(error)
    }
  })
})

exports.refreshStaffToken = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      req.body
      const token = req.query.token as string
      const { uid } = await admin.auth().verifyIdToken(token)
      const user = await admin.auth().getUser(uid)

      const allowedRoles =
        user.customClaims?.['https://hasura.io/jwt/claims']?.[
          'x-hasura-allowed-roles'
        ] || []

      if (allowedRoles.includes(StaffRole)) {
        res.status(200).send()
        return
      } else {
        const millisecondsSinceSignIn =
          Date.now() - new Date(user.metadata.lastSignInTime).getTime()

        if (millisecondsSinceSignIn > StaffTokenTTL) {
          res.status(401).send()
          return
        } else {
          const result = await fetch(graphqlConfig.url, {
            headers: {
              'content-type': 'application/json',
              'x-hasura-admin-secret': graphqlConfig.admin_secret,
            },
            method: 'POST',
            body: JSON.stringify({
              query: SelectUser,
              variables: {
                firebase_uid: uid,
              },
            }),
          })
          const { data, error } = await result.json()
          const user = data.users[0]

          if (error) {
            functions.logger.error('Error calling hasura:', error)
            res.status(503).send()
            return
          }
          if (!user?.staff_until || new Date(user.staff_until) < new Date()) {
            res.status(403).send()
            return
          }

          const userRef = users.doc(uid)
          await userRef.set(
            {
              id: user.id,
              removeStaffRoleClaimAt: JSON.stringify(
                new Date(Date.now() + StaffTokenTTL),
              ),
            },
            { merge: true },
          )

          await admin.auth().setCustomUserClaims(uid, {
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': ['anonymous', 'user', StaffRole],
              'x-hasura-default-role': 'user',
              'x-hasura-user-id': user.id,
            },
          })

          res.status(200).send()
        }
      }
    } catch (error) {
      functions.logger.error('refresh staff token error', error)
      res.status(400).send(error)
    }
  })
})

// exports.removeStaffRoles = functions.pubsub
//   .schedule('every 1 hour')
//   .onRun((context) => {
//     console.log('This will be run every hour!')
//     return null
//   })
