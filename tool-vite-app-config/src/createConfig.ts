import { resolve } from 'path'
import { UserConfigFn } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

import importFrontMatterPlugin from './importFrontMatterPlugin.js'
import importHighlightedSourcePlugin from './importHighlightedSourcePlugin.js'
import importGlobExtensionsPlugin from './importGlobExtensionsPlugin.js'
import mdxPlugin from './mdxPlugin.js'
import reactEmotionPlugin from './reactEmotionPlugin.js'
import reactSVGPlugin from './reactSVGPlugin.js'

export interface PluginOptions {
  projectRootDir: string
}

export default function createConfig({ projectRootDir }: PluginOptions) {
  const workspaceRootDir = resolve(projectRootDir, '..')

  const configFunction: UserConfigFn = ({ mode }) => ({
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      importFrontMatterPlugin(),
      importHighlightedSourcePlugin(),
      importGlobExtensionsPlugin(),
      react({
        jsxImportSource: '@emotion/react',
      }),
      tsconfigPaths({
        loose: true,
        root: workspaceRootDir,
      }),
      reactSVGPlugin({
        defaultExport: 'component',
        expandProps: 'end',
        memo: true,
        ref: true,
        svgo: mode === 'production',
        titleProp: true,
      }),
      reactEmotionPlugin(),
      mdxPlugin(),
    ],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-is'],
    },
    optimizeDeps: {
      include: ['hoist-non-react-statics', 'react-is'],
    },
  })

  return configFunction
}
