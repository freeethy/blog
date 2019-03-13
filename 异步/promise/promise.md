# promise

[JavaScript Promise：简介](https://developers.google.com/web/fundamentals/primers/promises)

## new Promise(function(resolve, reject) {});

- resolve(thenable)

Promise 依据 thenable 的结果而执行/拒绝。

- resolve(obj)

Promise 执行并返回 obj

- reject(obj)

Promise 拒绝并返回 obj。为保持一致和调试（例如堆叠追踪），obj 应为 instanceof Error。 在构造函数回调中引发的任何错误将隐式传递给 reject()。

## promise.then(onFulfilled, onRejected)

当/如果“promise”解析，则调用 onFulfilled。当/如果“promise”拒绝，则调用 onRejected。 两者均可选，如果任意一个或两者都被忽略，则调用链中的下一个 onFulfilled/onRejected。 两个回调都只有一个参数：执行值或拒绝原因。 then() 将返回一个新 promise，它相当于从 onFulfilled/onRejected 中返回、 通过 Promise.resolve 传递的值。如果在回调中引发了错误，返回的 promise 将拒绝并返回该错误。

## promise.catch(onRejected)

对 promise.then(undefined, onRejected)
