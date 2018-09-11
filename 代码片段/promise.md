# promise

## 将一个回调函数转成 promise

```javascript
function promisify(fn) {
  return function(...args) {
    return new Promise(function(resolve, reject) {
      fn.apply(null, [
        ...args,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      ]);
    });
  };
}
```
