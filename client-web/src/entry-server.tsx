/// <reference types="react/experimental" />
/// <reference types="vite/client" />

import createStyleCache from '@emotion/cache'
import {
  CacheProvider as StyleCacheProvider,
  ThemeContext,
  css,
} from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import type { Request, Response } from 'express'
import { cloneElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Helmet, HelmetData, HelmetProvider } from 'react-helmet-async'
import { Mount, ServerMount } from 'retil-mount'
import { createHref } from 'retil-nav'
import { CSSProvider } from 'retil-css'
import { ServerStyleSheet } from 'styled-components'

import { App } from './components/app'
import { retilDataCacheName } from './constants/htmlGeneration'
import { createServerAppEnv } from './env/serverAppEnv'
import appLoader from './pages/appLoader'
import { AppGlobalStyles } from './styles/appGlobalStyles'

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

  const sheet = new ServerStyleSheet()
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
      const { html: appHTML, styles: appStyles } = extractCriticalToChunks(
        renderToString(
          sheet.collectStyles(
            mount.provide(
              <StyleCacheProvider value={styleCache}>
                <CSSProvider runtime={css} themeContext={ThemeContext}>
                  <AppGlobalStyles />
                  <Mount loader={appLoader} env={env}>
                    <App />
                  </Mount>
                </CSSProvider>
              </StyleCacheProvider>,
            ),
          ),
        ),
      )

      // Render the head separately, as once it is done, as this makes it
      // possible to stream the rest of the content.
      const helmetContext = {} as { helmet: HelmetData }
      renderToString(
        <HelmetProvider context={helmetContext}>
          <Helmet>
            <title>The Daily Paragraph</title>
            {env.head.map((item, i) => cloneElement(item, { key: i }))}
          </Helmet>
        </HelmetProvider>,
      )

      const cache = env.cache?.extract()
      const dataHTML = cache
        ? `<script>window.${retilDataCacheName} = ${JSON.stringify(
            cache,
          )}</script>`
        : ''

      const styledComponentsStyleTags = sheet.getStyleTags()
      const headHTML = `
        ${helmetContext.helmet.title.toString()}
        ${helmetContext.helmet.meta.toString()}
        ${helmetContext.helmet.script.toString()}
        ${helmetContext.helmet.style.toString()}
        ${constructStyleTagsFromChunks({ html: appHTML, styles: appStyles })}
        ${styledComponentsStyleTags}
      `

      return {
        headHTML,
        appHTML,
        dataHTML,
      }
    }
  } finally {
    sheet.seal()
    mount.seal()
  }
}
