# whistle

> https://whistle.gitbooks.io/help/content/  

## 使用
按照以上文档上成功安装whistle后，我是使用Proxy SwitchySharp(https://chrome.google.com/webstore/detail/proxy-switchysharp/dpplabbmogkhghncfbfdeeokoefdjegm)配置的代理，简单方便。

1. Proxy SwitchySharp中 新建情景模式whistle
2. 代理协议 HTTP  代理服务器127.0.0.1  代理端口8899 保存设置 
3. 地址栏访问 http://127.0.0.1:8899/#rules 
4. Create 新建rules
5. 在rules中配置规则，参考官方文档，如
```
http://dev.aaa.com/index/  http://127.0.0.1:8080/build/  

# 正则 
/^http:\/\/dev\.aaa\.com\/build\/js\/([\w]*)\.js/ http://127.0.0.1:8080\build\js/$1.js
```
6. 访问 http://dev.aaa.com/index/ 时将Proxy SwitchySharp 的情景模式切换为whistle或是autoswitch（需要设置访问规则）
