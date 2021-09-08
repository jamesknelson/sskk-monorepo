import fetch from 'node-fetch'

import { config, logger } from '../firebase'

// Not necessary at runtime, but added as a hint to tooling that these
// are in fact GraphQL queries.
const gql = (x: TemplateStringsArray) => x.join('')

const graphqlConfig = config.graphql

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
    logger.error(options.errorMessage, '|', errors)
    throw errors
  }

  return data
}

// ---

interface CreateHasuraCustomerOptions {
  displayName?: string
  // photoURL?: string
  uid: string
  unverifiedEmail: string
}

const InsertCustomer = gql`
  mutation InsertCustomer(
    $firebase_uid: String!
    $unverified_email: String!
    $display_name: String
  ) {
    insert_customers_one(
      object: {
        contact_name: $display_name
        firebase_uid: $firebase_uid
        unverified_email: $unverified_email
      }
    ) {
      id
    }
  }
`

export async function createHasuraCustomer({
  displayName,
  uid,
  unverifiedEmail,
}: CreateHasuraCustomerOptions): Promise<string> {
  const variables: Record<string, string> = {
    firebase_uid: uid,
    unverified_email: unverifiedEmail,
  }
  if (displayName) {
    variables['display_name'] = displayName
  }

  const data = await postQuery({
    query: InsertCustomer,
    variables,
    errorMessage: "Couldn't create hasura customer",
  })

  const hasuraCustomerId =
    data?.insert_profiles_one?.user?.id || data?.insert_customers_one?.id

  if (!hasuraCustomerId) {
    throw new Error(data.error)
  }

  return hasuraCustomerId
}

// ---

export const DeleteCustomer = gql`
  mutation DeleteUser($customer_id: uuid!) {
    delete_customers_by_pk(id: $customer_id) {
      id
    }
  }
`

export async function deleteHasuraCustomer(customerId: string): Promise<void> {
  await postQuery({
    errorMessage: "Couldn't delete customer from hasura",
    query: DeleteCustomer,
    variables: {
      customer_id: customerId,
    },
  })
}
