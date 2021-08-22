import { encodeUUID, nestURLSchema, urlSchema } from 'src/utils/urls'

import { LetterParams, LetterQuery } from './letter/letterURLs'
import profileURLs, { ProfileParams } from './profile/profileURLs'

const urls = urlSchema({
  // editor: nestURLSchema('/editor', editorURLs),

  hello: () => `/hello`,

  // join: nestURLSchema('/join', joinURLs),

  /**
   * Shows a letter on a page without the selection bar. On mobile, links from
   * the selection bar will use this route with a `from` param, while on a
   * two-column layout, double clicking in the selection bar will cause this
   * link to be used – and should also cause the selection bar to be animated
   * out.
   */
  letter: ({
    profileNametag,
    letterId,
    letterSlug,
    ...query
  }: LetterParams & LetterQuery) => ({
    query: { ...query },
    pathname: `/${profileNametag}/${letterSlug || ''}~${encodeUUID(letterId)}`,
  }),

  login: () => `/login`,
  logout: () => `/logout`,

  policies: () => `/policies`,

  profile: nestURLSchema(
    (profileParams: ProfileParams) => `/${profileParams.nametag}`,
    profileURLs,
  ),

  // read: nestURLSchema('/read', readURLs),

  recoverAccount: () => `/recover-account`,

  // settings: nestURLSchema('/settings', settingsURLs),
})

export default urls
