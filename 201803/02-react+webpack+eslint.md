# react+webpack+eslint

基于 vscode，需安装插件 eslint 和 prettier，并在首选项-设置中配置如下：

```
"eslint.autoFixOnSave": true,
"editor.formatOnSave": true,
```

配置完后，保存时代码会自动按照 eslint 和 prettier 的默认规则进行格式化

## webpack 配置

```
rules: [
    {
    test: /\.jsx|js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    loader: 'eslint-loader',
    }
]
```

## .eslintrc.js

```
module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    $PATH: true,   //代码中需要使用的webpack中配置的全局变量
  },
  parser: "babel-eslint",
  extends: ["airbnb", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    // "linebreak-style": ["error", "windows"],
    //修改airbnb及eslint自带部分规则
    //type效验
    "react/prop-types": 1,
    // 数组的key不能使用数组的index
    "react/no-array-index-key": 1,
    //驼峰命名
    camelcase: 1,
    "linebreak-style": 0,
    //未使用变量
    "no-unused-vars": 1,
    //将>多行JSX元素放在末尾单独放在下一行
    "react/jsx-closing-bracket-location": 0,
    // click事件应该对应一个键盘事件
    "jsx-a11y/click-events-have-key-events": 0,
    // 通过role语义化元素
    "jsx-a11y/no-static-element-interactions": 0,
    // 使用jsx语法的文件得是jsx后缀
    // "react/jsx-filename-extension": 0,
    // jsx indent(导致jsx中缩进不对)
    "react/jsx-indent": 0,
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    "import/no-extraneous-dependencies": 0,
    //对锚链接做验证
    "jsx-a11y/anchor-is-valid": 0,
    //require需要写在顶层域
    "global-require": 1,
    "prettier/prettier": [
      "error",
      //修改prettier的规则,使其满足eslint冲突部分的规则
      {
        //单引号
        singleQuote: true,
        //数组尾部加逗号
        trailingComma: "all",
        //对象{}内部加入空格
        bracketSpacing: false,
        //将>多行JSX元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）。
        jsxBracketSameLine: true
      }
    ]
  },
  // 使webpack resolve符合规则校验
  settings: {
    "import/resolver": "webpack"
  }
};
```
