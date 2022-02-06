/// <reference types="react/experimental" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { Request, Response } from 'express'
import { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ServerMount } from 'retil-mount'
import { createHref, createServerNavEnv } from 'retil-nav'

import { App, appLoader } from './app'
import { createHeadSink, renderHeadSinkToString } from './head'

export async function render(
  request: Omit<Request, 'params' | 'query'>,
  response: Response,
) {
  const head = [] as ReactElement[]
  const env = {
    ...createServerNavEnv(request, response as any),
    head,
  }

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
    await mount.preload()

    if (
      (response.statusCode >= 300 && response.statusCode < 400) ||
      response.statusCode >= 500
    ) {
      return null
    } else {
      const headSink = createHeadSink()
      const { html: appHTML, styles: appStyles } = extractCriticalToChunks(
        renderToString(
          mount.provide(
            <App env={env} headSink={headSink} styleCache={styleCache} />,
          ),
        ),
      )
      const headHTML = [
        renderHeadSinkToString(headSink),
        constructStyleTagsFromChunks({ html: appHTML, styles: appStyles }),
      ].join('\n')

      return {
        appHTML,
        headHTML,
      }
    }
  } finally {
    mount.seal()
  }
}
