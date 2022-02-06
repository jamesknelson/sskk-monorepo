import { createScheme } from 'retil-nav-scheme'

export default createScheme({
  top: () => `/`,

  writeIntroLetter: () => `/write-intro-letter`,
  createAccount: () => `/create-account`,
  selectMembershipType: () => `/select-membership-type`,
  enterPaymentDetails: () => `/enter-payment-details`,
  chooseAddress: () => `/choose-address`,
  confirmAndComplete: () => `/confirm-and-complete`,
})
