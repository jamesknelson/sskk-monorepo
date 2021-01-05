import * as React from 'react'
import { routeByPattern } from 'retil-router'

import AccountDetails from './accountDetailsPage'
import ChangePassword from './changePasswordPage'

function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <p>Blurb blurb blurb</p>
    </div>
  )
}

export const router = routeByPattern({
  './': <SettingsPage />,
  './account-details': <AccountDetails />,
  './change-password': <ChangePassword />,
})
