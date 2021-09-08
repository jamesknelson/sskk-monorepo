import { join, resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths-alt'

import reactEmotion from './vite/reactEmotion'

const projectRootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  esbuild: {
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',

    // We're using emotion's "jsx" factory, but instead of importing directly
    // from emotion, we import from a local shim that also re-exports Fragment
    // – allowing us to use JSX fragments without also importing React.
    jsxInject: `import {Fragment, jsx} from '${join(__dirname, 'react-shim')}'`,
  },
  plugins: [
    mode !== 'production' && require('@vitejs/plugin-react-refresh')(),
    tsconfigPaths({
      root: projectRootDir,
      projects: ['.'],
    }),
    reactEmotion(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-is'],
  },
}))
