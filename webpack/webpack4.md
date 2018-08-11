# webpack4

[webpack4](https://wanago.io/2018/07/16/webpack-4-course-part-one-entry-output-and-es6-modules/)

## entry, output

## loaders

```
module.exports = function(source){
    return source;
}
```

## plugins

we used combined css-loader and style-loader to inject our css code into the \<style\> tag. You might prefer to serve actual css files to your users. To do that, use mini-css-extract-plugin.

[extract-text-webpack-plugin vs. Mini CSS Extract Plugin (=> Use Mini CSS Extract Plugin)](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/749)

之前使用的 extract-text-webpack-plugin，webpack4 中使用 mini-css-extract-plugin(仅支持 webpack4，不支持 3)，需要在 js 中引入 css 文件

extract-text-webpack-plugin:

```
plugins:[
    new ExtractTextWebpackPlugin(
        isPro ? "css/[name].[chunkhash].css" : "css/[name].css"
    )
]
```

mini-css-extract-plugin:

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new MiniCssExtractPlugin()
    ]
}
```

## code spliting

将公共代码，dependencies 放在单独的 js 文件中，浏览器缓存，避免多次下载  
之前版本使用 CommonsChunkPlugin，webpack4 中使用 SplitChunksPlugin

```
// CommonsChunkPlugin
//通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。
//将你的代码拆分成第三方公共代码和应用代码。
entry:{
    vendor: ["jQuery"]
},
plugins:[
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: Infinity
        // 随着 entrie chunk 越来越多，
        // 这个配置保证没其它的模块会打包进 vendor chunk
    })
]
```

```
// SplitChunksPlugin
optimization: {
    splitChunks: {
        chunks: "all",
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
}
```

## Built-in optimization for production

```
mode: "production"
```

### UglifyJsPlugin

[uglifyOptions-compress](https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options)
[uglifyOptions-output](https://github.com/mishoo/UglifyJS2/tree/harmony#user-content-output-options)

```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: "production",
    // using mode: "production" attaches the following configuration:
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin()
        ]
    },
}
```

### DefinePlugin

This plugin allows you to create global constants resolved at compile time.

```
module.exports = {
    mode: "production",   // development/production
    // using mode: "production" attaches the following configuration:
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
    ]
}
```

### NoEmitOnErrorsPlugin

> Using this plugin will help you deal with errors during the compilation. For example, there might be a situation in which you try to import a file that Webpack can’t resolve. In this situation, Webpack creates a new version of the application with the information about the error. With the usage of NoEmitOnErrorsPlugin, this version is not created at all.

```
const webpack = require('webpack');

module.exports = {
    mode: "production",
    // using mode: "production" attaches the following configuration:
    plugins: [
        new webpack.NoEmitOnErrorsPlugin();
    ]
}
```

### ModuleConcatenationPlugin

the output bundle is now in one scope. Fewer functions mean less runtime overhead
生成的文件更简洁，运行效率更高

## Increasing development experience

```
mode: "development"
```

```
"scripts": {
    "build": "webpack",
    "start": "webpack-dev-sever"
}
```

```
npm install webpack-dev-server
npm start
```

### Hot Module Replacement

```
const webpack = require('webpack');

module.exports = {
    devServer: {
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

> Note that running webpack-dev-server with the –hot flag would also add HotModuleReplacementPlugin to your plugins. Doing it twice could give you problems.

### DefinePlugin

```
module.exports = {
    mode: "development",
    // using mode: "development" attaches the following configuration:
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
    ]
}
```

### NamedModulesPlugin

It is useful while using Hot Module Replacement. Thanks to NamedModulesPlugin we can see the relative path of the replaced module.

```
[WDS] App updated. Recompiling...
[WDS] App hot update...
[HMR] Checking for updates on the server...
[HMR] Updated modules:
[HMR]  - ./src/style.css
[HMR] App is up to date
```

### NamedChunksPlugin

An additional advantage to NamedModulesPlugin and NamedChunksPlugin is that you no longer use ids that can change with adding and removing dependencies. Since ids or names are used in actual output files, changing them will change the hash of the file, even if the content of the module did not change. Using NamedModulesPlugin and NamedChunksPlugin will help you deal with **caching** in browsers. Let’s compare some output code.

Without NamedModulesPlugin and NamedChunksPlugin:

```
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{
  /***/ 6:
  (...) // divide.js module output code

  /***/ 7:
  (...) // substract.js module output code
]);
```

Using NamedModulesPlugin and NamedChunksPlugin:

```
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["utilities~main"],{
  /***/ "./src/utilities/divide.js":
  (...) // divide.js module output code

  /***/ "./src/utilities/substract.js":
  (...) // substract.js module output code
]);
```

### Devtool

JavaScript

```
module.exports = {
    mode: "development",
    // using mode: "development" attaches the following configuration:
    devtool: "eval"
}
```
