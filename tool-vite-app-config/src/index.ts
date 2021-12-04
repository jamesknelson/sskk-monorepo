import { UserConfigFn } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

import reactEmotion from './reactEmotion.js'
import svgPlugin from './reactSVG.js'

export interface PluginOptions {
  projectRootDir: string
}

export default function createConfig({ projectRootDir }: PluginOptions) {
  const configFunction: UserConfigFn = ({ mode }) => ({
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
      tsconfigPaths({
        root: projectRootDir,
        projects: ['.'],
      }),
      svgPlugin({
        defaultExport: 'component',
        expandProps: 'end',
        memo: true,
        ref: true,
        svgo: mode === 'production',
        titleProp: true,
      }),
      reactEmotion(),
    ],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-is'],
    },
  })

  return configFunction
}
