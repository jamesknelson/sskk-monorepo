import { createScheme } from 'retil-nav-scheme'

export default createScheme({
  /**
   * A daily summary page for individaul members, hopefully customizable to
   * each member's tastes. Can include things like big buttons linking to feeds
   * like their inbox, or pieces quoting their own pieces – with a number
   * showing how many new items there are today, along with how many unreads.
   */
  summary: () => `/`,

  /**
   * A list of everything addressed to you, either publicly or privately.
   */
  inbox: () => `/inbox`,
})
