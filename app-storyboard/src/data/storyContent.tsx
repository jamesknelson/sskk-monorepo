import { ComponentType, ReactElement } from 'react'
import { NavEnvService, NavRequest, NavResponse } from 'retil-nav'

import { StoryMeta, getStoryMeta } from './storyMeta'

export interface StoryContent {
  Doc: ComponentType<{}>
  meta: StoryMeta
}

export type StoryClientMain = (
  render: (element: ReactElement) => void,
  mappedEnv: () => NavEnvService,
) => Promise<void>

export type StoryServerMain = (
  render: (element: ReactElement) => void,
  request: NavRequest,
  response: NavResponse,
) => Promise<void>

export async function getStoryContent(
  dirname: string,
  filename: string,
): Promise<null | StoryContent> {
  const loaders = import.meta.glob('../../../lib-ui-web/src/**/*.stories.mdx')
  const key = `../../../lib-ui-web/src/${dirname}/${filename}.stories.mdx`
  const loader = loaders[key]

  if (!loader) {
    return null
  }

  const mod = await loader()

  if (typeof mod?.default !== 'function') {
    throw new Error(`Story "${filename}" must export a default component.`)
  }

  const { default: Doc, meta: moduleMeta = {} } = mod
  const meta = getStoryMeta(dirname, filename, moduleMeta)

  return {
    Doc,
    meta,
  }
}
