import { urlSchema } from 'src/utils/urls'

const urls = urlSchema({
  top: () => `/`,

  writeIntroLetter: () => `/write-intro-letter`,
  createAccount: () => `/create-account`,
  selectMembershipType: () => `/select-membership-type`,
  enterPaymentDetails: () => `/enter-payment-details`,
  chooseAddress: () => `/choose-address`,
  confirmAndComplete: () => `/confirm-and-complete`,
})

export default urls
