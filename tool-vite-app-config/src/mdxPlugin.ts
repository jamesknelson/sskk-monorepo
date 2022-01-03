import type { CompileOptions as MDXCompileOptions } from '@mdx-js/mdx'
import type { PluggableList } from 'unified'
import type { Plugin as VitePlugin } from 'vite'

import rehypePrism from 'rehype-prism-plus'
import remarkEmoji from 'remark-emoji'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGFM from 'remark-gfm'
import remarkImages from 'remark-images'
import { remarkMdxFrontmatter } from 'remark-mdx-frontmatter'
import remarkTextr from 'remark-textr'
import remarkSlug from 'remark-slug'
import textr from 'textr'
import typographicApostrophes from 'typographic-apostrophes'
import typographicQuotes from 'typographic-quotes'
import typographicApostrophesForPlurals from 'typographic-apostrophes-for-possessive-plurals'
import typographicEllipses from 'typographic-ellipses'
import { VFile } from 'vfile'

export interface ViteMDXOptions
  extends Omit<MDXCompileOptions, 'remarkPlugins' | 'rehypePlugins'> {
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
}

export interface ViteMDXPlugin extends VitePlugin {
  mdxOptions: ViteMDXOptions
}

export const defaultOptions: ViteMDXOptions = {
  jsxImportSource: '@emotion/react',
  providerImportSource: '@mdx-js/react',
  remarkPlugins: [
    remarkFrontmatter,
    [remarkMdxFrontmatter, { name: 'meta' }],
    remarkGFM,
    remarkSlug,
    remarkImages,
    remarkEmoji,
    [
      remarkTextr,
      {
        plugins: [
          textr().use(
            typographicApostrophes,
            typographicQuotes,
            typographicApostrophesForPlurals,
            typographicEllipses,
            // em dashes
            (input: string) => input.replace(/--/gim, '—'),
            // en dashes,
            (input: string) => input.replace(/(\d)-(\d)/gim, '$1–$2'),
          ),
        ],
      },
    ],
  ],
  rehypePlugins: [rehypePrism],
}

export default function mdxPlugin(options = defaultOptions): ViteMDXPlugin {
  const mdxPlugin: ViteMDXPlugin = {
    name: 'vite-plugin-mdx',
    // I can't think of any reason why a plugin would need to run before mdx; let's make sure `vite-plugin-mdx` runs first.
    enforce: 'pre',
    mdxOptions: options,
    configResolved({ plugins, mode }) {
      // @vitejs/plugin-react-refresh has been upgraded to @vitejs/plugin-react,
      // and the name of the plugin performing `transform` has been changed from 'react-refresh' to 'vite:react-babel',
      // to be compatible, we need to look for both plugin name.
      // We should also look for the other plugins names exported from @vitejs/plugin-react in case there are some internal refactors.
      const reactRefreshPlugins = plugins.filter(
        (p) =>
          p.name === 'react-refresh' ||
          p.name === 'vite:react-babel' ||
          p.name === 'vite:react-refresh' ||
          p.name === 'vite:react-jsx',
      )
      const reactRefresh = reactRefreshPlugins.find((p) => p.transform)
      const transform = createTransformer(mode)

      this.transform = async function (code, id, ssr) {
        if (/\.mdx?$/.test(id)) {
          code = await transform(new VFile({ path: id, value: code }), options)
          const refreshResult = await reactRefresh?.transform!.call(
            this,
            code,
            id + '.js',
            ssr,
          )

          return (
            refreshResult || {
              code,
              map: { mappings: '' },
            }
          )
        }
      }
    },
  }

  return mdxPlugin
}

function createTransformer(mode: string) {
  return async function transform(code: VFile, mdxOptions?: ViteMDXOptions) {
    const { compile } = await import('@mdx-js/mdx')
    const code_jsx = await compile(code, {
      development: mode !== 'production',
      ...mdxOptions,
    })
    return code_jsx.toString('utf-8')
  }
}
