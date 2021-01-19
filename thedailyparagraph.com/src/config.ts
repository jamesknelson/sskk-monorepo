export const auth = {
  refreshTokenEndpoint: process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT!,
}

export const firebaseEmulators = {
  auth: process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_AUTH,
}

export const firebase = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

export const graphqlURL = process.env.NEXT_PUBLIC_GRAPHQL_URL!

export const publicURL = process.env.NEXT_PUBLIC_URL!
