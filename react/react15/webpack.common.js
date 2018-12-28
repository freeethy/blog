const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require("happypack");

const packageJson = require("./package.json");
const env = process.env.NODE_ENV;
// 环境判断
var isDev = env === "development", // 开发环境
  isPro = env !== "development" && env !== "debug", // 生产环境
  isDebug = env === "debug"; // 生产调试环境

// 打包配置
var packConfig = {
  // 入口
  entry: {
    index: path.resolve(__dirname, "./src/index.js")
  },
  // 出口
  output: {
    path: path.join(__dirname, "./build/"),
    filename: isPro ? "js/[name].[chunkhash].js" : "js/[name].js",
    sourceMapFilename: isPro ? "js/[name].[chunkhash].map" : "js/[name].map",
    publicPath: "/"
  },
  // 模块配置
  module: {
    loaders: [
      {
        test: /\.js|jsx?$/,
        exclude: /(node_modules)/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ["happypack/loader?id=babel"]
      },
      {
        test: /\.(mp3|wav)$/,
        loader: "file-loader",
        exclude: /node_modules/
      },
      //样式文件解析
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              // modules:true,
              // minimize: true
            }
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "url-loader?limit=10000&name=img/[name].[hash].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          options: {
            publicPath: "https://cdn.example.com/assets/"
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader?name=css/[name].[hash]"]
      }
    ]
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(["build"]),
    //复制指定文件
    // new CopyWebpackPlugin([
    //   {
    //     from: "./src/img",
    //     to: "./img"
    //   }
    // ]),
    new HappyPack({
      //用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: "babel",
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  targets: {
                    browsers: [
                      "last 2 versions",
                      "Firefox ESR",
                      "> 1%",
                      "ie >= 9",
                      "iOS >= 8",
                      "Android >= 4"
                    ]
                  }
                }
              ],
              "stage-2"
            ],
            plugins: [["transform-react-jsx", { pragma: "h" }]] // jsx语法编译使用的包装函数
          }
        }
      ]
    }),
    new ExtractTextPlugin(
      isPro ? "css/[name].[chunkhash].css" : "css/[name].css"
    ),
    //通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。
    //将你的代码拆分成第三方公共代码和应用代码。
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
      // 随着 entrie chunk 越来越多，
      // 这个配置保证没其它的模块会打包进 vendor chunk
    }),
    new HtmlWebpackPlugin({
      // 生成出来的html文件名
      filename: "index.html",
      // 每个html的模版，这里多个页面使用同一个模版
      template: "src/index.html",
      // 自动将引用插入html
      inject: true,
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      chunks: "index"
    })
  ],
  devtool: "#source-map"
};

module.exports = packConfig;
