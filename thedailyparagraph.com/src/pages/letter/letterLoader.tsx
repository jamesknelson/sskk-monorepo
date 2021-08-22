import { loadAsync } from 'retil-mount'
import { NotFoundError } from 'retil-nav'

import {
  LetterByIdDocument,
  LetterByHandleAndSlugDocument,
  LetterFieldsFragment,
} from 'src/generated/graphql'
import { AppEnv } from 'src/env/appEnv'
import { PrecachedQuery } from 'src/utils/precachedQuery'
import { urls } from 'src/utils/urls'
import { decodeUUID } from 'src/utils/uuid'

export type LetterParams = {
  letterId: string
  letterSlug?: string
  profileNametag: string
}
export type LetterQuery = {
  /**
   * If this is set to a *known and supported* url, then the back button in
   * the mobile interface will point there, and this will also affect the
   * match on the primary navigation bar.
   */
  from?: string
}

const loader = loadAsync(async (env: AppEnv<LetterParams, LetterQuery>) => {
  const {
    letterId: maybeEncodedLetterId,
    letterSlug,
    profileNametag,
  } = env.nav.params

  let queryPromise: Promise<PrecachedQuery<{ letters: LetterFieldsFragment[] }>>

  try {
    if (maybeEncodedLetterId) {
      const letterId = decodeUUID(maybeEncodedLetterId)
      queryPromise = env.precacheQuery(
        LetterByIdDocument,
        { post_id: letterId },
        'anonymous',
      )
    } else if (profileNametag && letterSlug) {
      queryPromise = env.precacheQuery(
        LetterByHandleAndSlugDocument,
        { handle: profileNametag, slug: letterSlug },
        'anonymous',
      )
    } else {
      throw new Error('Missing parameters')
    }
  } catch (error) {
    throw new NotFoundError(env.nav)
  }

  const pageModulePromise = import('./letterPage')
  const query = await queryPromise

  const letter = query.data.letters[0]
  if (
    !letter ||
    (profileNametag && letter.profile?.handle !== profileNametag)
  ) {
    throw new NotFoundError(env.nav)
  }

  const path = urls.letter({
    profileNametag: letter.profile!.handle!,
    letterId: letter.id,
    letterSlug: letter.slug,
  })

  if (path.pathname !== env.nav.pathname) {
    throw new NotFoundError(env.nav)
  }

  const { Page } = await pageModulePromise

  return <Page query={query} />
})

export default loader
