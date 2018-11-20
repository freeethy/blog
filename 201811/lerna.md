# lerna

[lerna](https://github.com/lerna/lerna)

A tool for managing JavaScript projects with multiple packages.  
参考 antd 源码

## Getting Started

```
npm install --global lerna
git init lerna-repo && cd lerna-repo
lerna init
```

仓库地址看起来是这样的：

```
my-lerna-repo/
  package.json
  packages/
    package-1/
      package.json
    package-2/
      package.json
```

## Commands

- lerna init
- lerna bootstrap
- lerna import <pathToRepo>
- lerna publish
- lerna changed
- lerna diff [package?]
- lerna run [script]
- lerna ls
