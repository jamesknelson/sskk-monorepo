import { urlSchema } from 'src/utils/urls'

const urls = urlSchema({
  // To start, ask for an email/password. Explain that you can't login with
  // Google or Facebook, as we value their privacy.
  createAccount: () => `/`,

  // Show the costs involved with the nametag, but do not ask for billing
  // information immediately.
  // Free nametags end with 4 random numbers, and the preceeding characters
  // or any combination of them with a subset of the 4 trailing numbers,
  // cannot match any existing paid handles.
  createNametag: () => `/create-nametag`,

  // Members must write an introduction that passes spam detection, with at
  // least 280 characters, before reserving a nametag.
  // Show the new nametag next to the introduction, with an option to edit
  // the nametag in a popup, showing any associated costs.
  writeIntroduction: () => `/write-introduction`,

  // Conditionally shown if the user has picked a paid membership. Charges
  // for 1 year of posting under this nametag, and reserves the name for 4
  // years after that.
  purchaseMembership: () => `/purchase-membership`,

  thankyou: () => `/thankyou`,
})

export default urls
