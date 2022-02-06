import { urlSchema } from 'src/util/urls'

const urls = urlSchema({
  changeEmail: () => `/change-email`,
  changePassword: () => `/change-password`,

  // Includes nametag and billing details
  membership: () => `/membership`,
})

export default urls
