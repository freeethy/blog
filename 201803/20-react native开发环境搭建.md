# react native 开发环境搭建(window,andriod)

## 开发环境

[开发环境搭建](https://reactnative.cn/docs/0.51/getting-started.html#content)

* 按照如上地址安装相应的软件，并配置环境变量
* 模拟器使用的 [Genymotion](https://www.genymotion.com/download)

## 测试安装

* 安装完成后，打开 Android Studio，在 settings/Plugins 下安装 Genymotion
* 然后再 settings/Other Settings/配置 Genymotion 的安装地址
* 工具栏会出现“Genymotion Device Manager”的图标，点击此图标，启动一个 android 模拟器，如果没有则新建一个模拟器
* 然后再终端运行以下代码，即可再打开的模拟器中运行 AwesomeProject 项目

```
react-native init AwesomeProject
cd AwesomeProject
react-native run-android
```

## 修改项目

现在已经成功运行了项目，我们可以开始尝试动手改一改了：

使用你喜欢的文本编辑器打开 App.js 并随便改上几行按两下 R 键，  
或是用 Menu 键（通常是 F2，在 Genymotion 模拟器中是 ⌘+M）  
打开开发者菜单，然后选择 Reload JS 就可以看到你的最新修改。  
在终端下运行 adb logcat \*:S ReactNative:V ReactNativeJS:V 可以看到你的应用的日志。
