import { createScheme } from 'retil-nav-scheme'

export default createScheme({
  changeEmail: () => `/change-email`,
  changePassword: () => `/change-password`,

  // Includes nametag and billing details
  membership: () => `/membership`,
})
