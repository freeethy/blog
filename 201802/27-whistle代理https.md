# whistle代理https
[whistle](https://github.com/avwo/whistle)  
[whistle：https](https://avwo.github.io/whistle/webui/https.html)  
公司网站改版成https啦，whistle代理修改以支持https，在windows系统下操作，因此下面只描述windows下的方式，别的系统详见whistle文档

## 安装证书
安装根证书及开启https拦截后才可以正常操作或抓取https及websocket请求，具体参见：[安装根证书](https://avwo.github.io/whistle/webui/https.html)

### 安装更新whistle
```
npm install -g whistle
```
### 启动生成新的根证书
```
w2 restart -A
```
### 下载安装证书
启动whistle后，在http://127.0.0.1:8899/#rules地址的https中用来下载根证书、隐藏connect类型的请求、开启Https拦截功能
![下载安装证书](https://avwo.github.io/whistle/img/https.gif)  
如上图下载完根证书后点击rootCA.crt文件，弹出根证书安装对话框  

[Windows安装证书](http://program.most.gov.cn/cert/ca.htm)  
[window10/edge中internet选项设置](https://jingyan.baidu.com/article/b907e6278e188e46e7891cb4.html)


