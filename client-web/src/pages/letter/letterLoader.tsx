import { loadAsync } from 'retil-mount'

// import {
//   LetterByIdDocument,
//   LetterByHandleAndSlugDocument,
//   LetterFieldsFragment,
// } from 'src/generated/graphql'
import { AppEnv } from 'src/env/appEnv'
// import urls from 'src/pages/appURLs'
// import { PrecachedQuery } from 'src/utils/precachedQuery'
// import { decodeUUID } from 'src/utils/uuid'

import { LetterParams, LetterQuery } from './letterURLs'

const loader = loadAsync<AppEnv<LetterParams, LetterQuery>>(async (_env) => {
  // const {
  //   letterId: maybeEncodedLetterId,
  //   letterSlug,
  //   profileNametag,
  // } = env.nav.params

  // let queryPromise: Promise<PrecachedQuery<{ letters: LetterFieldsFragment[] }>>

  // try {
  //   if (maybeEncodedLetterId) {
  //     const letterId = decodeUUID(maybeEncodedLetterId)
  //     queryPromise = env.precacheQuery(
  //       LetterByIdDocument,
  //       { post_id: letterId },
  //       'anonymous',
  //     )
  //   } else if (profileNametag && letterSlug) {
  //     queryPromise = env.precacheQuery(
  //       LetterByHandleAndSlugDocument,
  //       { handle: profileNametag, slug: letterSlug },
  //       'anonymous',
  //     )
  //   } else {
  //     throw new Error('Missing parameters')
  //   }
  // } catch (error) {
  //   return notFoundLoader(env)
  // }

  const pageModulePromise = import('./letterPage')
  // const query = await queryPromise

  // const letter = query.data.letters[0]
  // if (
  //   !letter ||
  //   (profileNametag && letter.profile?.handle !== profileNametag)
  // ) {
  //   return notFoundLoader(env)
  // }

  // const path = urls.letter({
  //   profileNametag: letter.profile!.handle!,
  //   letterId: letter.id,
  //   letterSlug: letter.slug || undefined,
  // })

  // if (path.pathname !== env.nav.pathname) {
  //   return notFoundLoader(env)
  // }

  const { Page } = await pageModulePromise

  return <Page />
})

export default loader
