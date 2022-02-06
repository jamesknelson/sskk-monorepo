import { extractGlobData } from '~/util/extractGlobData'

import { getStoryMeta } from './storyMeta'

// These two strings should match! The second one must be provided directly as
// a string literal to placate vite, while the first one should match the
// second one so that we're able to create a pattern that correctly extracts
// the package and example names.
//
// prettier-ignore
const glob =
  '../../../lib-ui-web/src/**/*.stories.mdx'
const frontMatters = import.meta.frontMatterGlobEager(
  '../../../lib-ui-web/src/**/*.stories.mdx',
)

const metas = extractGlobData(glob, frontMatters).map(
  ({ value, matches: [dirname, slug] }) => getStoryMeta(dirname, slug, value),
)

export default metas
