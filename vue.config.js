module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://join.wolfpackit.nl',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  transpileDependencies: true,
};
