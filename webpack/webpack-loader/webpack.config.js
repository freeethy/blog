const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolveLoader: {
    modules: [
      path.resolve("node_modules"),
      path.resolve(__dirname, "src", "loaders")
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "loader1"
          }
        ]
      },
      {
        test: /\.html|.htm$/,
        use: [
          {
            loader: "html-template-loader",
            options: {
              name: "@includehtml",
              root: "src/template/"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 生成出来的html文件名
      filename: "index.html",
      // 每个html的模版，这里多个页面使用同一个模版
      template: "src/index.html",
      // 自动将引用插入html
      inject: true
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      //   chunks: [name]
    })
  ]
};
