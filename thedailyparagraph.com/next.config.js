module.exports = {
  experimental: {
    jsconfigPaths: true,
    reactMode: 'blocking',
    reactStrictMode: true,
  },

  typescript: {
    ignoreDevErrors: false,
  },

  webpack: (config, options) => {
    config.module.rules.push({
      loader: require.resolve('file-loader'),
      // Exclude `js` files to keep "css" loader working as it injects
      // its runtime that would otherwise be processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpacks internal loaders.
      include: [/\.svg$/],
      options: {
        name: 'static/media/[name].[hash:8].[ext]',
      },
    })

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })

    config.resolve.alias['styled-components/macro'] = require.resolve(
      'styled-components',
    )

    return config
  },
}
