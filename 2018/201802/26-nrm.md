# nrm
[nrm](https://www.npmjs.com/package/nrm)  

> 同事的电脑出了点问题重装了，需要使用公司内部源，教她使用nrm管理，正好记一下，偷个懒~哈哈哈哈~~

安装npm后，使用npm安装包时，默认使用的源是https://registry.npmjs.org/，经常出现下载资源很慢或下载失败；公司内部搭建npm，需要使用公司内部的源。基于上面的情况，使用nrm管理源会方便很多。

## 安装
```
npm i -g nrm
```

## 添加源
```
nrm add 源名称 源地址
```

## 查看源列表
```
nrm ls
```

## 使用源
```
nrm use 源名称
```

## 查看帮助  
```
nrm -h
```