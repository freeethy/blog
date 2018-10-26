# Electron 应用架构

## 主进程和渲染进程

Electron 运行 package.json 的 main 脚本的进程被称为主进程。 在主进程中运行的脚本通过创建 web 页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的渲染进程中。

在普通的浏览器中，web 页面通常在一个沙盒环境中运行，不被允许去接触原生的资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。

### 主进程和渲染进程之间的区别

主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的 web 页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作

## 使用 Electron 的 API

在主进程和渲染进程中，你可以通过 require 的方式将其包含在模块中以此，获取 Electron 的 API

```
const electron = require('electron')
```

所有 Electron 的 API 都被指派给一种进程类型。 许多 API 只能被用于主进程中，有些 API 又只能被用于渲染进程，又有一些主进程和渲染进程中都可以使用。

## 使用 Node.js 的 API

Electron 同时在主进程和渲染进程中对 Node.js 暴露了所有的接口

- 所有在 Node.js 可以使用的 API，在 Electron 中同样可以使用
- 可以在你的应用程序中使用 Node.js 的模块
