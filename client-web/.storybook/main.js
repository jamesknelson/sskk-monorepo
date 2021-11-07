const { dirname, resolve } = require('path')
const { plugins } = require('prismjs')
const { default: tsconfigPaths } = require('vite-tsconfig-paths')
const react = require('@vitejs/plugin-react')

const reactEmotion = require('../vite/reactEmotion')
const svgPlugin = require('../vite/reactSVG')

const projectRootDir = resolve(__dirname, '..')

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: 'storybook-builder-vite',
  },
  async viteFinal(config, { configType }) {
    config.define = {
      ...config.define,

      'process.env.NODE_ENV': JSON.stringify(configType.toLowerCase()),
    }

    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['@storybook/store', ...config.optimizeDeps.include],
    }

    // Remove the automatically added react plugin  so that we can set up
    // emotion's jsx transform ourself.
    const usedPlugins = [...config.plugins]
    usedPlugins.pop()

    config.plugins = [
      tsconfigPaths({
        root: projectRootDir,
        projects: ['.'],
      }),

      svgPlugin({
        defaultExport: 'component',
        expandProps: 'end',
        memo: true,
        ref: true,
        svgo: configType === 'PRODUCTION',
        titleProp: true,
      }),

      reactEmotion(),

      ...usedPlugins,

      react({
        jsxImportSource: '@emotion/react',

        // Do not treat story files as HMR boundaries, storybook itself needs to handle them.
        // See https://github.com/eirslett/storybook-builder-vite/blob/dbcbba33b81fc20865a3a9fb0f89b12738ecdf26/packages/storybook-builder-vite/vite-config.js#L63
        exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
      }),
    ]

    config.resolve = {
      ...config.resolve,

      dedupe: [
        ...(config.resolve?.dedupe || []),
        'react',
        'react-dom',
        'react-is',
      ],
    }

    // return the customized config
    return config
  },
}
