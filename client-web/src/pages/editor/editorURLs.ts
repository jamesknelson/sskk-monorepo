import { urlSchema } from 'src/utils/urls'

export type EditorLetterParams = { letterId: string }

const urls = urlSchema({
  dashboard: () => `/dashboard`,

  drafts: () => `/drafts`,

  letter: (params: EditorLetterParams) => `/~${params.letterId}`,
  new: () => `/new`,

  published: () => `/published`,
})

export default urls
