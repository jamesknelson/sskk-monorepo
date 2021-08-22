import { loadLazy } from 'retil-mount'
import { loadMatch, loadNotFoundBoundary } from 'retil-nav'
import { AppEnv } from 'src/env'

import {
  encodeUUID,
  nestURLSchema,
  patternFor,
  urlSchema,
} from 'src/utils/urls'

import notFoundLoader from './notFoundLoader'

export const appUrls = urlSchema({
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

  read: nestURLSchema('/read', readURLs),

  recoverAccount: () => `/recover-account`,

  settings: nestURLSchema('/settings', settingsURLs),
})

const appLoader = loadNotFoundBoundary(
  loadMatch<AppEnv>({
    // [urls.editor.index()]: loadLazy(() => import('./editor/editorLoader')),

    [patternFor(appUrls.hello)]: loadLazy(() => import('./hello/helloLoader')),

    // [urls.join()]: loadLazy(() => import('./join/joinLoader')),

    // [urls.letter(
    //   generatePatternParams({
    //     profileNametag: true,
    //     letterSlug: false,
    //     letterId: true,
    //   }),
    // ).pathname]: loadLazy(() => import('./letter/letterLoader')),

    // [urls.login()]: loadLazy(() => import('./loginLoader')),
    // [urls.logout()]: loadLazy(() => import('./logoutLoader')),

    // [urls.policies()]: loadLazy(() => import('./policiesLoader')),

    // [urls.recoverAccount()]: loadLazy(
    //   () => import('./recoverAccountLoader'),
    // ),

    // [urls.settings()]: loadLazy(
    //   () => import('./settings/settingsLoader'),
    // ),

    // //
    // // !!! THIS MUST BE LAST !!!
    // // The profile pattern must be last, as it is a wildcard
    // //
    // [urls.profile({ nametag: true })]: loadLazy(
    //   () => import('./profile/profileLoader'),
    // ),
  }),
  notFoundLoader,
)

export default appLoader
