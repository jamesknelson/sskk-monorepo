import { createScheme, nestScheme } from 'retil-nav-scheme'

// import editorURLs from './editor/editorURLs'
import joinScheme from './join/joinScheme'
// import { LetterParams, LetterQuery } from './letter/letterURLs'
// import profileURLs, { ProfileParams } from './profile/profileURLs'
import readScheme from './read/readScheme'
// import settingsURLs from './settings/settingsURLs'

export default createScheme({
  top: () => '/',

  // editor: nestURLSchema('/editor', editorURLs),

  // /**
  //  * Shows a letter on a page without the selection bar. On mobile, links from
  //  * the selection bar will use this route with a `from` param, while on a
  //  * two-column layout, double clicking in the selection bar will cause this
  //  * link to be used – and should also cause the selection bar to be animated
  //  * out.
  //  */
  // letter: ({
  //   personaAddress,
  //   letterId,
  //   letterSlug,
  //   ...query
  // }: LetterParams & LetterQuery) => ({
  //   query: { ...query },
  //   pathname: `/@${personaAddress}/${letterSlug || ''}~${encodeUUID(letterId)}`,
  // }),

  login: () => `/login`,
  logout: () => `/logout`,

  join: nestScheme('/join', joinScheme),

  policies: () => `/policies`,

  // profile: nestURLSchema(
  //   (profileParams: ProfileParams) => `/@${profileParams.nametag}`,
  //   profileURLs,
  // ),

  read: nestScheme('/read', readScheme),

  recoverAccount: () => `/recover-account`,

  // settings: nestURLSchema('/settings', settingsURLs),
})
