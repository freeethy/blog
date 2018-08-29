# webpack 调试源码

[如何使用 Chrome 调试 webpack 源码](https://github.com/lihongxun945/diving-into-webpack/blob/master/6-process-pipe-line.md)

```
node --inspect-brk ./node_modules/webpack/bin/webpack.js --config webpack.config.js
```

然后打开 chrome，打开一个新页面，地址是： chrome://inspect，就可以在 chrome 中调试你的代码了。
