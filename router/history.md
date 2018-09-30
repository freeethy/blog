# history

[react-router Histories](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)

## hashHistory

Hash History 使用 URL 中的 hash(#)部分去创建形如 example.com/#/some/path 的路由  
Hash history 不需要服务器任何配置就可以运行,但是不推荐在线上环境使用

当一个 history 通过应用程序的 push 或 replace 跳转时，它可以在新的 location 中存储“location state”而不显示在 URL 中，这就像是在一个 HTML 中 post 表单数据。

在 DOM API 中，这些 hash history 通过 **window.location.hash = newHash** 很简单地被用于跳转，且不用存储它们的 location state。但我们想全部的 history 都能够使用 location state，因此我们要为每一个 location 创建一个唯一的 key，并把它们的状态存储在 session storage 中。当访客点击“后退”和“前进”时，我们就会有一个机制去恢复这些 location state。

## browserHistory

[historyAPI](https://developer.mozilla.org/en-US/docs/Web/API/History)

它使用浏览器中的 History API 用于处理 URL，创建一个像 example.com/some/path 这样真实的 URL 。

### 服务器配置

browserHistory 需要服务器处理 URL

### IE8, IE9 支持情况

如果我们能使用浏览器自带的 window.history API，那么我们的特性就可以被浏览器所检测到。如果不能，那么任何调用跳转的应用就会导致 全页面刷新，它允许在构建应用和更新浏览器时会有一个更好的用户体验，但仍然支持的是旧版的。

你可能会想为什么我们不后退到 hash history，问题是这些 URL 是不确定的。如果一个访客在 hash history 和 browser history 上共享一个 URL，然后他们也共享同一个后退功能，最后我们会以产生笛卡尔积数量级的、无限多的 URL 而崩溃。

## memoryHistory

Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。
