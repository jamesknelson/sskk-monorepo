module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['styled-components', { ssr: true }],
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
          },
        },
      },
    ],
  ],
}
