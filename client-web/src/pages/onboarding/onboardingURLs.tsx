import { urlSchema } from 'src/utils/urls'

const urls = urlSchema({
  // To start, ask for an email/password. Explain that you can't login with
  // Google or Facebook, as we value their privacy.
  createAccount: () => `/`,

  // Start by showing two address types, one with a number out the front,
  // another with the and a photo.
  // Show the costs involved with the nametag, but do not ask for billing
  // information immediately. Only allow addresses which haven't been taken
  // by a paid address yet.
  createAddress: () => `/create-address`,

  // Members must write an introduction that passes spam detection, with at
  // least 280 characters, before reserving a nametag.
  // Show the new nametag next to the introduction, with an option to edit
  // the nametag in a popup, showing any associated costs.
  // Show a warning that we can't hold your name for you, so try and write
  // the introduction quickly.
  writeIntroduction: () => `/write-introduction`,

  // Conditionally shown if the user has picked a paid membership. Charges
  // for 1 year of posting under this nametag, and reserves the name for 4
  // years after that.
  purchaseMembership: () => `/purchase-membership`,

  thankyou: () => `/thankyou`,
})

export default urls
