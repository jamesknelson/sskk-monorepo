import { cloneElement } from 'react'
import { Helmet, HelmetData, HelmetProvider } from 'react-helmet-async'

import { fontPreloadLinks } from '~/style/fonts'

import { useAppEnv } from './appEnv'

export type HeadContext = { helmet?: HelmetData }

export interface HeadProps {
  context?: HeadContext
}

export function Head(props: HeadProps) {
  const env = useAppEnv()
  const elements = env.hydrating ? null : env.head
  return elements ? (
    <HelmetProvider context={props.context}>
      <Helmet>
        <title>letter.house</title>
        {fontPreloadLinks
          .concat(elements)
          .map((item, i) => cloneElement(item, { key: i }))}
      </Helmet>
    </HelmetProvider>
  ) : null
}

export function renderHeadContextToString(context: HeadContext) {
  return `
    ${context.helmet?.title.toString()}
    ${context.helmet?.link.toString()}
    ${context.helmet?.meta.toString()}
    ${context.helmet?.script.toString()}
    ${context.helmet?.style.toString()}
  `
}
