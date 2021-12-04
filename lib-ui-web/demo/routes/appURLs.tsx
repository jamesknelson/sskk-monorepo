import { scheme } from 'retil-url'

export default scheme({
  top: () => '/',

  exampleIndex: () => `/examples`,
  example: (params: { slug: string }) => `/examples/${params.slug}`,
})
