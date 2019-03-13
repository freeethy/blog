# storybook

[storybook](https://storybook.js.org/)

## 背景

公司内部基于 antd 扩展了一个公用组件库，主要是按照公司内部 UI 标准，加入了自定义主题，以及对一些通用组件（如布局、搜索区、表单、表格等）进行了封装。

组件展示借鉴的 antd，使用的 Bisheng+lerna 管理展示，但是此种架构不便于调试组件，每次修改均需要重新手动打包，严重影响开发效率。因此考虑使用 Storybook 来支持组件开发过程的展示。

## Introduction

Storybook is a user interface development environment and playground for UI components. The tool enables developers to create components independently and showcase components interactively in an isolated development environment.

Storybook runs outside of the main app so users can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Storybook for React

As our skill stack is React, so we use the instruction of "Storybook for React".

First, I tried automatic setup

```
npx -p @storybook/cli sb init --type react
```

but it result a error as follow:

```
? Please choose a project type from the following list: REACT
 • Adding storybook support to your "React" app
     TypeError: Cannot create property 'dependencies' on boolean 'false'
    at _callee$ (C:\Users\icsoc-dev\AppData\Roaming\npm-cache\_npx\32244\node_modules\@storybook\cli\generators\REACT/index.js:18:3)
    at call (C:\Users\icsoc-dev\AppData\Roaming\npm-cache\_npx\32244\node_modules\@storybook\cli\node_modules\regenerator-runtime/runtime.js:62:40)
    at Generator.tryCatch [as _invoke] (C:\Users\icsoc-dev\AppData\Roaming\npm-cache\_npx\32244\node_modules\@storybook\cli\node_modules\regenerator-runtime/runtime.js:288:22)
    at Generator._invoke [as next] (C:\Users\icsoc-dev\AppData\Roaming\npm-cache\_npx\32244\node_modules\@storybook\cli\node_modules\regenerator-runtime/runtime.js:114:21)
    at asyncGeneratorStep (C:\Users\icsoc-dev\AppData\Roaming\npm-cache\_npx\32244\node_modules\@storybook\cli\generators\REACT\index.js:34:103)
    at _next (C:\Users\icsoc-dev\AppData\Roaming\npm-cache\_npx\32244\node_modules\@storybook\cli\generators\REACT\index.js:36:194)
    at process._tickCallback (internal/process/next_tick.js:68:7)
```

Then I have to tried manual setup, here is the steps:

- Step 1: init

```
npx -p @storybook/cli sb init
```

This will generator two folders: ./storybook and stories.

- Step 2: Add dependencies

```
npm install @storybook/react --save-dev
npm install react react-dom --save
npm install babel-loader @babel/core --save-dev
```

If there are some other dependencies that have been used but not installed, use npm or yarn to install them.

- Step 3: Add a npm script

package.json

```
{
  "scripts": {
    "storybook": "start-storybook"
  }
}
```

At last, you can run "npm run storybook" to run the program.

```
npm run storybook
```

## Custom Webpack Config

.storybook/webpack.config.js

```js
const path = require("path");
const theme = require("antd-ex/lib/less/theme");

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              modifyVars: theme,
              javascriptEnabled: true
            } // compiles Less to CSS
          }
        ],
        include: path.resolve(__dirname, "../")
      }
    ]
  }
};
```

## Custom Babel Config

.storybook/.babelrc

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["last 2 versions", "Firefox ESR"]
        }
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    // [
    //   "import",
    //   {
    //     "libraryName": "antd",
    //     "style": true
    //   }
    // ],
    "@babel/plugin-proposal-class-properties"
  ]
}
```

## Antd And Antd-ex style

.storybook/config.js

```js
import "antd/dist/antd.less";
import "antd-ex/lib/less/index.less";
```

## Conclusion

If you use less and you get a error as follow:

```
Error: Cannot find module 'less'
```

Please run "npm install less --save-dev" to install the less module.

Then enjoy youself.
