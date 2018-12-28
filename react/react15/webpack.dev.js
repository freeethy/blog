const path = require("path");
const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");

const webpack = require("webpack");

if (process.env.NODE_ENV !== "development") {
  CommonConfig.output.publicPath = "/";
  CommonConfig.output.filename = "js/[name].js";
  CommonConfig.output.sourceMapFilename = "js/[name].map";
}

module.exports = Merge(CommonConfig, {
  //此选项控制是否生成，以及如何生成 source map。
  devtool: "inline-source-map",
  plugins: [
    //当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
    //也是用于vendor  hash 变化的修复
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devServer: {
    //指定静态文件的路径
    contentBase: path.resolve(__dirname, "build"),
    allowedHosts: [
      //白名单
      "localhost",
      "127.0.0.1"
      // '.host.com',//可以匹配所有xx.host.com
      // 'subdomain.host.com',
      // '192.168.0.103'
    ],
    compress: true, //开启gzip
    port: 8008,
    proxy: {
      // "/ticket/": {
      //   target: "http://xxx.xxx",
      //   changeOrigin: true
      // }
    },
    //当单页模式采用HTML5 History API 时
    //开启此选项,任意的 404 响应都可能需要被替代为index.html,可以通过rewrites进一步详细指定
    historyApiFallback: false
    // publicPath: "/assets/"
  }
});
