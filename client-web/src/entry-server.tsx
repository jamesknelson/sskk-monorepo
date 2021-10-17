/// <reference types="react/experimental" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import type { Request, Response } from 'express'
import { renderToString } from 'react-dom/server'
import { ServerMount } from 'retil-mount'
import { createHref } from 'retil-nav'

import { App } from './app'
import { appPageSerializedDataGlobal } from './constants/htmlGeneration'
import { createServerAppEnv } from './env/serverAppEnv'
import { HeadContext, renderHeadContextToString } from './head'
import appLoader from './pages/appLoader'

export async function render(
  request: Omit<Request, 'params' | 'query'>,
  response: Response,
) {
  const env = createServerAppEnv(request, response)

  if (request.path !== env.nav.pathname) {
    response.statusCode = 308
    response.setHeader('Location', createHref(env.nav))
    return null
  }

  const mount = new ServerMount(appLoader, env)
  const styleCache = createStyleCache({ key: 'sskk' })
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(styleCache)

  try {
    const { env } = await mount.preload()

    if (
      (response.statusCode >= 300 && response.statusCode < 400) ||
      response.statusCode >= 500
    ) {
      return null
    } else {
      const cache = env.cache?.extract()
      const dataHTML = cache
        ? `<script>window.${appPageSerializedDataGlobal} = ${JSON.stringify({
            cache,
            context: env.mutablePersistedContext,
          })}</script>`
        : ''
      const headContext = {} as HeadContext
      const { html: appHTML, styles: appStyles } = extractCriticalToChunks(
        renderToString(
          mount.provide(
            <App
              env={env}
              headContext={headContext}
              loader={mount.loader}
              styleCache={styleCache}
            />,
          ),
        ),
      )
      const headHTML = [
        renderHeadContextToString(headContext),
        constructStyleTagsFromChunks({ html: appHTML, styles: appStyles }),
      ].join('\n')

      return {
        headHTML,
        appHTML,
        dataHTML,
      }
    }
  } finally {
    mount.seal()
  }
}
