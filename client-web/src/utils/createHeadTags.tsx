import type { ReactElement } from 'react'
import { ensureTruthyArray } from 'retil-support'

interface CreateHeadTagsInput {
  title?: string
  meta?: Record<string, string | string[]>
}

export function createHeadTags(input: CreateHeadTagsInput) {
  const tags = [] as ReactElement[]

  if (input.title) {
    tags.push(<title>{input.title}</title>)
  }
  if (input.meta) {
    const keys = Object.keys(input.meta)
    for (const key of keys) {
      const contents = ensureTruthyArray(input.meta[key])
      tags.push(
        ...contents.map((content) => <meta name={key} content={content} />),
      )
    }
  }

  return tags
}
