module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
        // {
        //   test: /\.styl$/,
        //   loader: ['style-loader', 'css-loader', 'stylus-loader'],
        // },
        {
          test: /\.(txt|zip|csv|xlsx)$/,
          loader: 'file-loader',
          options: {
            name: `files/[name].[ext]`,
          },
        },
        // {
        //   test: /\.json$/,
        //   loader: 'json-loader',
        //   type: 'javascript/auto',
        //   options: {
        //     name: `files/[name].[ext]`,
        //   },
        // },
      ],
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'ja',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};
