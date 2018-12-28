# immer

[immer](https://github.com/mweststrate/immer)

## 优点

* JS 原生数据结构实现的 immutable （主要使用 Proxy，defineProperty 作为 fallback）
* 结构共享

> 性能方面与 facebook 的 immutable-js 做对比，在 immutable 数据的操作过程中确实 immutable 数据效率更高一些，但是因为 immutable-js 数据无法序列化，所以必须得有 toJS 操作，再加上前期的 fromJS 成本，immer 直接操作原生数据结构可以说略强一些。

## 缺点

转换成 es5 性能会比较差？？？

## 参考

[精读《Immer.js》源码](https://github.com/dt-fe/weekly/blob/master/48.%E7%B2%BE%E8%AF%BB%E3%80%8AImmer)

[下一代状态管理工具 immer 简介及源码解析](https://zhangzhao.name/2018/02/01/immer%20-%20immutable/)
