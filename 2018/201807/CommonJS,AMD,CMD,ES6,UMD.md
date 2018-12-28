# CommonJS, AMD, CMD, ES6, UMD

## CommonJS

> 根据 CommonJS 规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在一个文件定义的变量（还包括函数和类），都是私有的，对其他文件是不可见的。
> CommonJS 加载模块是同步的.所以只有加载完成才能执行后面的操作。
> CommonJS 定义的模块分为:{模块引用(require)} {模块定义(exports)} {模块标识(module)}

### 特点

1、CommonJs 规范的出发点：JS 没有模块系统、标准库较少、缺乏包管理工具；为了让 JS 可以在任何地方运行，以达到 Java、C#、PHP 这些后台语言具备开发大型应用的能力；

2、在 CommonJs 规范中：

    一个文件就是一个模块，拥有单独的作用域；

    普通方式定义的变量、函数、对象都属于该模块内；

    通过require来加载模块；

    通过exports和module.exports来暴露模块中的内容；

3、所有代码都运行在模块作用域，不会污染全局作用域；模块可以多次加载，但只会在第一次加载的时候运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果；模块的加载顺序，按照代码的出现顺序是同步加载的;

4、\_\_dirname 代表当前模块文件所在的文件夹路径，\_\_filename 代表当前模块文件所在的文件夹路径+文件名;

5、require（同步加载）基本功能：读取并执行一个 JS 文件，然后返回该模块的 exports 对象，如果没有发现指定模块会报错;

6、模块内的 exports：为了方便，node 为每个模块提供一个 exports 变量，其指向 module.exports，相当于在模块头部加了这句话：var exports = module.exports，在对外输出时，可以给 exports 对象添加方法，PS：不能直接赋值（因为这样就切断了 exports 和 module.exports 的联系）;

### 原理

浏览器不兼容 CommonJS 的根本原因，在于缺少四个 Node.js 环境的变量。

```
module
exports
require
global
```

只要能够提供这四个变量，浏览器就能加载 CommonJS 模块。

下面是一个简单的示例。

```
var module = {
exports: {}
};

(function(module, exports) {
exports.multiply = function (n) { return n \* 1000 };
}(module, module.exports))

var f = module.exports.multiply;
f(5) // 5000
```

上面代码向一个立即执行函数提供 module 和 exports 两个外部变量，模块就放在这个立即执行函数里面。模块的输出值放在 module.exports 之中，这样就实现了模块的加载。

## AMD

提前执行依赖

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出

AMD 异步加载模块。它的模块支持对象 函数 构造器 字符串 JSON 等各种类型的模块。

适用 AMD 规范适用 define 方法定义模块。

## UMD

1.对于依赖的模块 AMD 是提前执行，CMD 是延迟执行。
2.CMD 推崇依赖就近，按需加载；AMD 推崇依赖前置。

umd 是 AMD 和 CommonJS 的糅合

AMD 浏览器第一的原则发展 异步加载模块。

CommonJS 模块以服务器第一原则发展，选择同步加载，它的模块无需包装(unwrapped modules)。

这迫使人们又想出另一个更通用的模式 UMD （Universal Module Definition）。希望解决跨平台的解决方案。

UMD 先判断是否支持 Node.js 的模块（exports）是否存在，存在则使用 Node.js 模块模式。

在判断是否支持 AMD（define 是否存在），存在则使用 AMD 方式加载模块。

```
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD

        define(['jquery', 'underscore'], factory);

    } else if (typeof exports === 'object') {

        // Node, CommonJS之类的

        module.exports = factory(require('jquery'), require('underscore'));

    } else {

        // 浏览器全局变量(root 即 window)

        root.returnExports = factory(root.jQuery, root._);

    }

}(this, function ($, _) {

    // 方法

    function a(){}; // 私有方法，因为它没被返回 (见下面)

    function b(){}; // 公共方法，因为被返回了

    function c(){}; // 公共方法，因为被返回了



    // 暴露公共方法

    return {

        b: b,

        c: c

    }

}));
```

## ES6

es6 通过 import、export 实现模块的输入输出。其中 import 命令用于输入其他模块提供的功能，export 命令用于规定模块的对外接口。

## 参考

[https://www.cnblogs.com/chenguangliang/p/5856701.html](https://www.cnblogs.com/chenguangliang/p/5856701.html)
[AMD (中文版)](<https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88)>)
