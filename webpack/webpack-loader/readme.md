# webpack-loader

webpack loader 开发初探

此项目主要是一个在 html 中引用 html 模板文件的 demo：src/loader/html-template-loader.js

```
git clone xxx
npm install
npm run dev
```

dist 下的 html 即为打包后的文件

加载自定义 loader,webpack.config.js:

```javascript
resolveLoader: {
    modules: [
      path.resolve("node_modules"),
      path.resolve(__dirname, "src", "loaders")
    ]
},
module: {
    rules: [
      {
        test: /\.html|.htm$/,
        use: [
          {
            loader: "html-template-loader",
            options: {
              name: "@includehtml",  // 引用前缀
              root: "src/template/"  // 文件目录
            }
          }
        ]
      }
    ]
}
```

引用方式：

```
<div>
    @includehtml(body.html)
</div>
```
