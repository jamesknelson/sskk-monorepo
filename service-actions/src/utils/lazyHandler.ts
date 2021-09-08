// Based on: https://github.com/azu/express-lazy-router

import { RequestHandler } from 'express'

export type createLazyHandlerOptions = {
  /**
   * iI preload is true, eagerly load all routes.
   * Default: false
   */
  preload?: boolean
}

export function createLazyHandler(options: createLazyHandlerOptions = {}) {
  const { preload = false } = options

  return function lazyHandler(
    resolver: () => Promise<{ default: RequestHandler }>,
  ) {
    // Preserve loading order of router for default error handler
    // https://github.com/azu/express-lazy-router/issues/1
    let loadedHandler: RequestHandler
    const resolveHandler = async () => {
      loadedHandler = loadedHandler || (await resolver()).default
      return loadedHandler
    }
    const lazyRouter: RequestHandler = async (req, res, next) => {
      try {
        const handler = await resolveHandler()
        return handler(req, res, next)
      } catch (error) {
        next(error)
      }
    }
    if (preload) {
      resolveHandler().catch((error) => {
        console.error('[lazy-handler] Fail to preload', error)
      })
    }
    return lazyRouter
  }
}
