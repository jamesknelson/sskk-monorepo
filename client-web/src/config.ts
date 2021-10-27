export const auth = {
  refreshTokenEndpoint: import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT as string,
}

export const firebase = JSON.parse(
  import.meta.env.VITE_FIREBASE_CONFIG as string,
)
export const firebaseEmulators = {
  auth: import.meta.env.VITE_FIREBASE_EMULATOR_AUTH as string,
}

export const graphqlURL = `${
  import.meta.env.VITE_GRAPHQL_PROTOCOL! as string
}://${import.meta.env.VITE_GRAPHQL_HOST_AND_PORT! as string}/v1/graphql`
