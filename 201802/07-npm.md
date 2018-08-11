# npm

## what is npm?
- [the website](https://www.npmjs.com/)
- the registry(a large database of information about packages)
- [the Command Line Interface(CLI)](https://docs.npmjs.com/cli/npm)

## How to install npm & manage npm version
1、安装node后，npm会自动安装。npm比node更新频繁，安装最新npm:
```
    npm install npm@lastest -g
```

2、nvm(Node Version Manager)
方便切换不同版本的node和npm
[nvm-windows](https://github.com/coreybutler/nvm-windows)

3、npm最新版本
[npm最新版本]https://docs.npmjs.com/getting-started/installing-node
页面底部

## How to Prevent Permissions Errors
1、Reinstall with a Node Version Manager
2、Change npm's Default Directory

## How to Install Local Packages
There are two ways to install npm packages: locally or globally. Choose which kind of installation to use based on how you want to use the package.

- If you want to depend on the package from your own module, using something like Node.js' require, then you want to install locally. This is npm install's default behavior.
- If you want to use a package as a command line tool, (such as grunt CLI), then install it globally.

## How to Update Local Packages
1、run npm update in the same directory as the package.json file of the application that you want to update.
2、Run npm outdated. There should not be any results.



## 单词
- consists 包括，有...组成
- permissions 许可，准许
