import * as functions from 'firebase-functions'
import fetch from 'node-fetch'

// Not necessary at runtime, but added as a hint to tooling that these
// are in fact GraphQL queries.
const gql = (x: TemplateStringsArray) => x.join('')

const graphqlConfig = functions.config().graphql

interface PostQueryOptions<Variables extends object> {
  errorMessage: string
  query: string
  variables: Variables
}
async function postQuery<Variables extends object>(
  options: PostQueryOptions<Variables>,
) {
  const result = await fetch(graphqlConfig.url, {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': graphqlConfig.admin_secret,
    },
    method: 'POST',
    body: JSON.stringify({
      query: options.query,
      variables: options.variables,
    }),
  })
  const { data, errors } = await result.json()

  if (errors || !data) {
    functions.logger.error(options.errorMessage, '|', errors)
    throw errors
  }

  return data
}

// ---

interface CreateHasuraMemberOptions {
  displayName?: string
  photoURL?: string
  uid: string
}

const InsertMemberOnly = gql`
  mutation InsertMember($firebase_uid: String!, $unverified_email: String!) {
    insert_members_one(
      object: {
        firebase_uid: $firebase_uid
        unverified_email: $unverified_email
      }
    ) {
      id
    }
  }
`

const InsertMemberAndProfile = gql`
  mutation InsertMemberAndProfile(
    $firebase_uid: String!
    $unverified_email: String!
    $avatar_url: String
    $display_name: String
  ) {
    insert_profiles_one(
      object: {
        user: {
          data: {
            firebase_uid: $firebase_uid
            unverified_email: $unverified_email
          }
        }
        display_name: $display_name
        avatar_url: $avatar_url
      }
    ) {
      id
      guesttag
      nametag
      user {
        id
      }
    }
  }
`

export async function createHasuraMember({
  displayName,
  photoURL,
  uid,
}: CreateHasuraMemberOptions): Promise<string> {
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

  const data = await postQuery({
    query: hasProfile ? InsertMemberAndProfile : InsertMemberOnly,
    variables,
    errorMessage: "Couldn't create hasura member",
  })

  const hasuraMemberId =
    data?.insert_profiles_one?.user?.id || data?.insert_members_one?.id

  if (!hasuraMemberId) {
    throw new Error(data.error)
  }

  return hasuraMemberId
}

// ---

export const DeleteMember = gql`
  mutation DeleteUser($member_id: uuid!) {
    delete_members_by_pk(id: $member_id) {
      id
    }
  }
`

export async function deleteHasuraMember(memberId: string): Promise<void> {
  await postQuery({
    errorMessage: "Couldn't delete member from hasura",
    query: DeleteMember,
    variables: {
      member_id: memberId,
    },
  })
}
