module.exports = {
  configureWebpack: {
    externals: {
      'VueRouter': 'vue-router',
      axios: 'axios',
      'jquery': '$'
    }
  },
  publicPath: './',
  devServer: {
    port: 8080, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: true,
    proxy: {
      '/api': {
        target: '<url>',
        ws: true,
        changeOrigin: true
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  }
}
