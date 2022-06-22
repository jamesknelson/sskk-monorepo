import { createScheme } from 'retil-nav-scheme'

export type EditorLetterParams = { letterId: string }

const urls = createScheme({
  dashboard: () => `/dashboard`,

  drafts: () => `/drafts`,

  letter: (params: EditorLetterParams) => `/~${params.letterId}`,
  new: () => `/new`,

  published: () => `/published`,
})

export default urls
