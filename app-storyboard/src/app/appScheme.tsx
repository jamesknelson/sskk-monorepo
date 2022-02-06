import { createScheme } from 'retil-nav-scheme'

export default createScheme({
  top: () => '/',

  storyIndex: () => `/stories`,
  story: (params: { dirname: string; filename: string }) =>
    `/stories/${encodeStoryDirnameParam(params.dirname)}/${params.filename}`,
})

function encodeStoryDirnameParam(dirname: string): string {
  return dirname.replace('/', '--')
}

export function parseStoryDirnameParam(dirnameParam: string) {
  return dirnameParam.replace('--', '/')
}
