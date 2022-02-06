import { loadAsync } from 'retil-mount'

import { DocumentContent } from '~/component/documentContent'

const topLoader = loadAsync(async () => {
  const { default: Component } = await import('./top.mdx')
  return <DocumentContent Component={Component} />
})

export default topLoader
