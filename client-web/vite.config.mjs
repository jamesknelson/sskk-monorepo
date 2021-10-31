import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

import reactEmotion from './vite/reactEmotion.js'
import svgPlugin from './vite/reactSVG.js'

const projectRootDir = resolve(dirname(fileURLToPath(import.meta.url)))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
}))
