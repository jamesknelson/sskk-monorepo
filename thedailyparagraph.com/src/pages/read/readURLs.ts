import { urlSchema } from 'src/utils/urls'

const urls = urlSchema({
  feed: () => `/`,
  inbox: () => `/inbox`,
})

export default urls
