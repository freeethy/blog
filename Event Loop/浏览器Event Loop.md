# 浏览器 Event Loop

- javascript 是一门单线程语言
- Event Loop 是 javascript 的执行机制

**本为仅讨论浏览器端的 Event Loop，node 端的暂不讨论**

## 宏任务和微任务

在 javascript 中，任务被分为 Task(又称为 MacroTask，宏任务)和 MicroTask(微任务)，他们包含一下内容：

> MacroTask: script（整体代码）,setTimeout, setInterval, setImmediate（node 独有）, I/O, UI rendering
> MicroTask: process.nextTick(node 独有), Promise, Object.observe(废弃), MutationObserver

## 事件循环机制

- 一个事件循环有一个或者多个任务队列（task queues）。任务队列是 task 的有序列表，这些 task 是以下工作的对应算法：Events，Parsing，Callbacks，Using a resource，Reacting to DOM manipulation。
- 每一个任务都来自一个特定的任务源（task source）。所有来自一个特定任务源并且属于特定事件循环的任务，通常必须被加入到同一个任务队列中，但是来自不同任务源的任务可能会放在不同的任务队列中。
- 每个事件循环都有一个进入 microtask 检查点（performing a microtask checkpoint）的 flag 标志，这个标志初始为 false。它被用来组织反复调用‘进入 microtask 检查点’的算法。

![](https://upload-images.jianshu.io/upload_images/3995692-cb316db1c839f4d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/697)

![](https://user-gold-cdn.xitu.io/2017/11/21/15fdd88994142347?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 同步和异步任务分别进入不同的执行“场所”，同步的进入主线程，异步的进入 Event Table 并注册函数
- 当指定的事情完成时，Event Table 会将这个函数移入 Event Queue（不同的任务源可能放在不同的 Event Queue）
- 主线程内的任务执行完毕为空，会去 Event Queue 读取对应的函数，进入主线程执行
- 上述过程不断重复，也就是常说的 Event Loop(事件循环)

> 不同类型的任务会进入对应的 Event Queue，比如 setTimeout 和 setInterval 会进入相同的 Event Queue。

> js 引擎存在 monitoring process 进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去 Event Queue 那里检查是否有等待被调用的函数。

## 事件循环的顺序

事件循环的顺序，决定 js 代码的执行顺序。进入整体代码(宏任务)后，开始第一次循环。接着执行所有的微任务。然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。
![事件循环，宏任务，微任务的关系如图](https://user-gold-cdn.xitu.io/2017/11/21/15fdcea13361a1ec?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 参考

[Event Loop 标准文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)  
[一次搞懂 Event loop](https://www.imooc.com/article/40020)  
[什么是浏览器的事件循环（Event Loop）？](https://segmentfault.com/a/1190000010622146)  
[这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)
