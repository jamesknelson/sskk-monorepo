import compression from 'compression'
import express from 'express'
import fs from 'fs'
import { dirname, resolve } from 'path'
import serveStatic from 'serve-static'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
const port = process.env.PORT || 3000

const resolveRoot = (p) => resolve(dirname(fileURLToPath(import.meta.url)), p)

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
) {
  const indexProd = isProd
    ? fs.readFileSync(resolveRoot('dist/server/index.html'), 'utf-8')
    : ''

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let viteDevServer
  if (!isProd) {
    viteDevServer = await createViteServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
    })
    // use vite's connect instance as middleware
    app.use(viteDevServer.middlewares)
  } else {
    app.use(compression())
    app.use(
      serveStatic(resolveRoot('dist/client'), {
        index: false,
      }),
    )
  }

  app.use('/', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      if (viteDevServer) {
        // always read fresh template in dev
        template = fs.readFileSync(resolveRoot('index.html'), 'utf-8')
        template = await viteDevServer.transformIndexHtml(url, template)
        render = (await viteDevServer.ssrLoadModule('/src/entry-server.tsx'))
          .render
      } else {
        template = indexProd
        render = require('./dist/server/entry-server.js').render
      }

      const result = await render(req, res)

      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.getHeader('Location')
      ) {
        return res.send()
      }

      res.setHeader('Content-Type', 'text/html')
      res.end(
        template
          .replace('<!--head-html-->', result.headHTML)
          .replace(`<!--app-html-->`, result.appHTML)
          .replace(`<!--data-html-->`, result.dataHTML),
      )
    } catch (e) {
      if (viteDevServer) {
        viteDevServer.ssrFixStacktrace(e)
      }
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite: viteDevServer }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(port, () => {
      console.log(`Server online at http://localhost:${port}`)
    }),
  )
}
