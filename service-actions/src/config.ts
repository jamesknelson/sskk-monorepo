import dotenv from 'dotenv'

dotenv.config()

export const hasuraGraphQLEndpoint = process.env
  .HASURA_GRAPHQL_ENDPOINT as string
export const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET as string

export const actionSecret = process.env.ACTION_SECRET as string

export const cookieSigningSecret = process.env.COOKIE_SIGNING_SECRET as string
