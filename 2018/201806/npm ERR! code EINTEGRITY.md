# npm ERR! code EINTEGRITY

```
npm ERR! code EINTEGRITY
npm ERR! sha512-l8csyPyLmtxskTz6pX9W8eDOyH1ckEtDttXk/vlFWCjv00SkjTjtoUrogqp4yEvMyneU9dUJoOLnqFoiHb8IHA== integrity checksum failed when using sha512: wanted sha512-l8csyPyLmtxskTz6pX9W8eDOyH1ckEtDttXk/vlFWCjv00SkjTjtoUrogqp4yEvMyneU9dUJoOLnqFoiHb8IHA== but got sha512-4SUlveu0TPy7YiG2bUOI0gkPoR+f9cQQOYF3YJDlnFtHrPi+W9VA7KntIVdLimFC0HphtIAj9k/SRNKstxEIuw==. (45689 bytes)
```

npm i 时又一次碰到这个问题啦，之前是本地搭建的 npm 源，各种方式都没能解决，然后把本地 npm 源换了个服务器；  
这次执行 npm cache verify 后就 ok 了，尚不明白原因，先记录一下。或者 yarn install。。。手动滑稽哈哈哈
