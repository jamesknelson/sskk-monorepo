import dotenv from 'dotenv'

dotenv.config()

export const inLocalDevelopment = !!process.env.FIREBASE_AUTH_EMULATOR_HOST

export const hasuraGraphQLEndpoint = `${
  process.env.HASURA_GRAPHQL_PROTOCOL! as string
}://${process.env.HASURA_GRAPHQL_HOST_AND_PORT! as string}/v1/graphql`

export const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET as string

export const actionSecret = process.env.ACTION_SECRET as string

export const cookieSigningSecret = process.env.COOKIE_SIGNING_SECRET as string

export const firebaseServiceAccount = process.env
  .FIREBASE_SERVICE_ACCOUNT as string

export const ssrSecret = process.env.SSR_SECRET as string

export const browserOrDeviceIdCookieName = 'sskk_client'
export const loginOperationName = 'Login'
