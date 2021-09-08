import dotenv from 'dotenv'

dotenv.config()

export const hasuraGraphQLEndpoint = `${
  process.env.HASURA_GRAPHQL_PROTOCOL! as string
}://${process.env.HASURA_GRAPHQL_HOST_AND_PORT! as string}/v1/graphql`

export const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET as string

export const actionSecret = process.env.ACTION_SECRET as string

export const cookieSigningSecret = process.env.COOKIE_SIGNING_SECRET as string
