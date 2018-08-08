# 13-webpack 打包浅析

参考  
[如何实现一个简单的 webpack](https://github.com/youngwind/blog/issues/99)  
[现代前端科技解析 —— Javascript Bundler](https://github.com/jin5354/404forest/issues/66)
[手把手教你撸一个简易的 webpack](https://zhuanlan.zhihu.com/p/37864523)

## 目的

如何将多个符合 CommonJS 规范的模块打包成一个 JS 文件，以供浏览器执行

## bundle.js

显然，浏览器没法直接执行 CommonJS 规范的模块，怎么办呢？
答案：将其转换成一个自执行表达式

## 梨子

我们实际要处理的例子是这个：example 依赖于 a、b 和 c，而且 c 位于 node_modules 文件夹中，我们要将所有模块构建成一个 JS 文件

## 思路

output.js：

1.  模块的头部都是一样的
2.  需要分析出各个模块间的依赖关系
3.  c 模块位于 node_modules 文件夹当中，但是我们调用的时候却可以直接 require('c')，这里肯定是存在某种**自动查找**的功能
4.  在生成的 output.js 中，每个模块的唯一标识是模块的 ID，所以在拼接 output.js 的时候，需要将每个模块的名字替换成模块的 ID

## 分析模块依赖关系

CommonJS 不同于 AMD，是不会在一开始声明所有依赖的。CommonJS 最显著的特征就是用到的时候再 require，所以我们得在整个文件的范围内查找到底有多少个 require

1.  正则
    缺点：
    如果 require 是写在注释中，也会匹配到。
    如果后期要支持 require 的参数是表达式的情况，如 require('a'+'b')，正则很难处理。

2.  AST
    使用 JS 代码解析工具（如 [esprima](https://github.com/jquery/esprima) 或者 [acorn](https://github.com/acornjs/acorn) ），将 JS 代码转换成抽象语法树（AST），再对 AST 进行遍历

匹配到 require 之后，这里有三个 require，按照 CommonJS 的规范，在检测到第一个 require 的时候，根据 require 即执行的原则，程序应该立马去读取解析模块 a。
如果模块 a 中又 require 了其他模块，那么继续解析。也就是说，总体上遵循**深度优先遍历算法**

## 找到模块

如果给出的是绝对路径/相对路径，只查找一次。找到？返回绝对路径。找不到？返回 false。
如果给出的是模块的名字，先在入口 js（example.js）文件所在目录下寻找同名 JS 文件（可省略扩展名）。找到？返回绝对路径。找不到？走第 3 步。
在入口 js（example.js）同级的 node_modules 文件夹（如果存在的话）查找。找到？返回绝对路径。找不到？返回 false。
逐层往上的查找，就像 nodejs 默认的模块查找算法那样。

## 拼接 output.js

在解决了模块依赖和模块查找的问题之后，我们将会得到一个依赖关系对象 depTree，此对象完整地描述了以下信息：都有哪些模块，各个模块的内容是什么，他们之间的依赖关系又是如何等等。具体的结构如下：

```
{
    "modules": {
        "/Users/youngwind/www/fake-webpack/examples/simple/example.js": {
            "id": 0,
            "filename": "/Users/youngwind/www/fake-webpack/examples/simple/example.js",
            "name": "/Users/youngwind/www/fake-webpack/examples/simple/example.js",
            "requires": [
                {
                    "name": "a",
                    "nameRange": [
                        16,
                        19
                    ],
                    "id": 1
                },
                {
                    "name": "b",
                    "nameRange": [
                        38,
                        41
                    ],
                    "id": 2
                },
                {
                    "name": "c",
                    "nameRange": [
                        60,
                        63
                    ],
                    "id": 3
                }
            ],
            "source": "let a = require('a');\nlet b = require('b');\nlet c = require('c');\na();\nb();\nc();\n"
        },
        "/Users/youngwind/www/fake-webpack/examples/simple/a.js": {
            "id": 1,
            "filename": "/Users/youngwind/www/fake-webpack/examples/simple/a.js",
            "name": "a",
            "requires": [],
            "source": "// module a\n\nmodule.exports = function () {\n    console.log('a')\n};"
        },
        "/Users/youngwind/www/fake-webpack/examples/simple/b.js": {
            "id": 2,
            "filename": "/Users/youngwind/www/fake-webpack/examples/simple/b.js",
            "name": "b",
            "requires": [],
            "source": "// module b\n\nmodule.exports = function () {\n    console.log('b')\n};"
        },
        "/Users/youngwind/www/fake-webpack/examples/simple/node_modules/c.js": {
            "id": 3,
            "filename": "/Users/youngwind/www/fake-webpack/examples/simple/node_modules/c.js",
            "name": "c",
            "requires": [],
            "source": "module.exports = function () {\n    console.log('c')\n}"
        }
    },
    "mapModuleNameToId": {
        "/Users/youngwind/www/fake-webpack/examples/simple/example.js": 0,
        "a": 1,
        "b": 2,
        "c": 3
    }
}
```

根据这个 depTree 对象，我们便能完成这最后的一步：**output.js 文件的拼接。**其控制逻辑无非是一层循环，有一个需要注意的地方，要把模块名转换成模块 ID

## 总结

### 生成的 bundle

1.  自执行函数，接收一个参数：modules
2.  modules 是 object， entry、a、b、c 等所有用到的模块包裹为一个函数。模块中所需的变量 module, require 将由参数传入。模块函数以编号为 key 按顺序挂在其下面
3.  所有模块内部的 require 函数的参数由相对路径被替换成了模块编号
4.  定义了 require 函数，接收模块编号作为参数。当执行 require 时先寻找 installedModules[模块编号] 是否存在，若不存在，则执行被 require 的模块函数，并将 module.exports 值挂在 installedModules[模块编号] 上
5.  由上条可知 installedModules 为缓存，这样在多次 require 同一个模块时不必多次执行该模块函数
6.  自执行函数中通过 require(0) 执行入口 js，启动程序

![](https://camo.githubusercontent.com/97db810e2ffb44329d34537c5f51afa273f2316f/68747470733a2f2f7777772e343034666f726573742e636f6d2f696d67732f626c6f672f62756e646c65722d312e706e67)

### 依赖收集

使用 JS 代码解析工具生成 AST，通过深度优先遍历这个 AST ，查找 require 相关表达式，我们就可以准确的识别出某一段代码中的依赖了，拿到依赖后，递归对依赖文件进行分析

### 模块查找, require 替换

### 拼装生成
