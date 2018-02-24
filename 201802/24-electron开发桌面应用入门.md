# electron开发桌面应用入门
electron是基于Node.js和Chromium做的一个工具。electron是的可以使用前端技术实现桌面开发，并且支持多平台运行。

## 快速启动项目
```
# 克隆示例项目的仓库
$ git clone https://github.com/electron/electron-quick-start

# 进入这个仓库
$ cd electron-quick-start

# 安装依赖并运行
$ npm install && npm start
```

## electron+react
1. 打开一个已有的react项目，安装electron（npm install -save electron）以及增加启动命令（在脚本里添加启动命令"start": "electron ."）
2. 将electron-quick-start下的main.js拷贝的项目根目录
3. package.json中加入
```
"main": "main.js",
"homepage": ".", 
"scripts": {
    "start": "electron .",  // 启动electron
    // "watch": "webpack --watch",
    // "dev": "cross-env NODE_ENV=development webpack-dev-server --color --config ./webpack.config.js --hot --inline --host 0.0.0.0",
    // "build": "cross-env NODE_ENV=development webpack --env=build"
},
```
> "homepage": ".": 默认情况下，homepage是http://localhost:3000，build后，所有资源文件路径都是/static，而Electron调用的入口是file:协议，/static就会定位到根目录去，所以找不到静态文件。在package.json文件中添加homepage字段并设置为"."后，静态文件的路径就变成了相对路径，就能正确地找到了。
4. - npm run dev启动react项目（webpack-dev-server模式） 
main.js中做如下修改，3001为端口号，根据实际情况修改  
   - npm run build生成/build/，则用注释掉的那段代码，'./build/index.html'改成相应的页面  
![main.js](https://github.com/freeethy/blog/blob/master/201802/images/electron-react-1.png)
5. webpack配置中需加入此段代码，处理const electron = require('electron')报错
```
externals: [
    (function () {
        var IGNORES = [
            'electron'
        ];
        return function (context, request, callback) {
            if (IGNORES.indexOf(request) >= 0) {
                return callback(null, "require('" + request + "')");
            }
            return callback();
        };
    })()
]
```

最后，在根目录运行npm run dev/build + npm run start就可以启动react创建的桌面应用了

## 需要执行cmd命令行
在main.js中加入如下代码，在需要的地方调用runExec即可
```
const exec = require('child_process').exec
function runExec(obj) {
  // 子进程名称
  // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
  let workerProcess = exec(obj.cmdStr, { cwd: obj.filepath })
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data)
  });

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
  });

  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('out code：' + code);
  })
}
```

## 打开文件夹/选择文件夹路径
```
const { remote } = electron
const { dialog } = remote
dialog.showOpenDialog({
    //选择操作，此处是打开文件夹
    properties: [
        'openDirectory',
    ],
    //过滤条件
    filters: [
        { name: 'All', extensions: ['*'] },
    ]
}, function (res) {
    //回调函数内容，此处是将路径内容显示在input框内
    
})
```

## 下载文件
main.js:
```
const ipcMain = electron.ipcMain
//主进程代码
ipcMain.on('download', (evt, args) => {
  // evt.sender.send('tips', args.downloadpath)
  // 触发下载操作
  mainWindow.webContents.downloadURL(args.downloadpath)
})

mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // 设置保存路径,使Electron不提示保存对话框。
    let url = filepath + '/' + filename + '/' + item.getFilename()
    item.setSavePath(url)

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
})
```

renderer.js:
```
const electron = require('electron')
const { ipcRenderer } = electron
ipcRenderer.send('download', {
    downloadpath: downloadpath,  //.zip、.pdf...
    filename: filename,
    filepath: filepath
})
```