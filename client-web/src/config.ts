export const auth = {
  refreshTokenEndpoint: import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT!,
}

export const firebaseEmulators = {
  auth: import.meta.env.VITE_FIREBASE_EMULATOR_AUTH as string,
}

export const firebase = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

export const graphqlURL = import.meta.env.VITE_GRAPHQL_URL! as string

export const publicURL = import.meta.env.VITE_URL!
