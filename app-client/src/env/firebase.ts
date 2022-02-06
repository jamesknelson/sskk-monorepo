import { FirebaseApp, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

import { firebase as firebaseConfig, firebaseEmulators } from '~/config'

let firebaseApp: FirebaseApp

export function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase should not be used during SSR.')
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig)

    if (firebaseEmulators.auth) {
      const auth = getAuth(firebaseApp)
      connectAuthEmulator(auth, firebaseEmulators.auth)
    }
  }

  return firebaseApp
}
