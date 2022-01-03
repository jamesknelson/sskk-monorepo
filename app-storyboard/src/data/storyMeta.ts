import startCase from 'lodash/startCase'

export interface StoryMeta {
  description?: string
  tags?: string[]
  dirname: string
  filename: string
  key: string
  title: string
}

export function getStoryMeta(
  dirname: string,
  filename: string,
  frontMatter: Record<string, any>,
): StoryMeta {
  const metaDefaults = {
    dirname,
    filename,
    key: [dirname, filename].join('/'),
    title: startCase(filename),
  }
  return {
    ...metaDefaults,
    ...frontMatter,
  }
}
