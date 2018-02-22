# node命令行工具
此篇文章探讨如何编写node命令行工具
参考[快速写个node命令行工具](https://segmentfault.com/a/1190000012199718)

## 刀耕火种时代
首先创建个bat文件（cli-demo.bat），bat文件中调用node命令执行相应的js文件（index.js）：
index.js内容：
```
'use strict';
function add(args) {
    var sum = 0;
    args.forEach(function(number){
        var num = +number;
        if(!isNaN(num)){
            sum += +num;    
        }
        
    })
    return sum;
}
var args = process.argv.slice(2); // 处理参数
var sum = add(args);
console.log(sum);
```

cli-demo.bat内容（index.js相同目录）：
```
@ECHO OFF
SETLOCAL
SET "NODE_EXE=%~dp0\node.exe"     
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"     ::
)
:: 执行指定的js，并传入参数
"%NODE_EXE%" "index.js" %*
```
然后把bat文件[路径添加到PATH环境变量](https://jingyan.baidu.com/article/db55b6099d1e0d4ba30a2fc0.html)中

在index.js父目录下打开cmd，并执行：
![cli demo 1 2 3](https://segmentfault.com/img/bVZlH4?w=370&h=48)  
创建bat文件，把bat路径添加到PATH中过程是复杂了点，还好npm可以帮我们做这些事

## npm与命令行工具

1. 初始化npm项目
```
npm init 
```

2. package.json中[bin配置](https://docs.npmjs.com/files/package.json#bin)
```
bin: {
"commandName1": "path/to/executableFile1",  
// 路径相对于package.json的目录
"commandName2": "path/to/executableFile2",
}
```

> 可执行文件可以是js文件或者无扩展名的文本文件，并且文件开头第一行是"#!/usr/bin/env node"。在安装包时npm就会根据bin配置生成对应的脚本（bat 或者 shell）。如果可执行文件的第一行不是"#!/usr/bin/env node"，则生成的脚本文件只是简单的指向bin配置的可执行文件。

## 梨子
1. 创建并配置package.json   
package.json：  
```
"bin": {
    "cli-demo": "./bin/cli-demo"
}
```
2. 在和package.json相同的目录下创建bin目录，在bin目录中添加cli-demo文本文件  
./bin/cli-demo:  
```
#!/usr/bin/env node
console.log('hello cli');
```
3. 发布包（前提在控制台登录npm账户）
```
npm login
npm publish
```   

4. 安装使用  
```
npm i -g cli-demo
cli-demo
```
查看下安装目录中生成的脚本文件：cli-demo.bat  
```
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\cli-demo\bin\cli-demo" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\cli-demo\bin\cli-demo" %*
)
```
文件内容就是调用node执行bin配置的文件  

> 不发布，本地使用，可以执行npm install -g 或者 npm link，
然后，执行cli-demo 

## npm干了什么
1. 根据bin字段配置，生成脚本文件（bat for window, shell for unix）
```
脚本名称：等于bin字段的属性名字
脚本内容：调用node名字执行bin字段对象属性值指定的文件
```

2. 把生产的脚本文件放在指定目录中
```
全局安装：prefix/
本地安装：./node_module/.bin/
```


## 扩展
一般一个命令由三部分构成：命令名称 选项 参数。
命名名称：指定运行的命名
选项：修改命令的操作行为
参数：传给命令运行的参数
处理选项和参数可以使用其他库，如CommandJS

