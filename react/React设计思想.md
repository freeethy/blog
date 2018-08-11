# React 设计思想

摘自： https://github.com/react-guide/react-basic

## 变换（Transformation）
认为UI只是把数据通过映射关系变换成另一种形式的数据。
纯函数，同样的输入必会有同样的输出。

## 抽象（Abstraction)
把UI抽象成多个隐藏内部细节，又可复用的函数。通过在一个函数中调用另一个函数来实现复杂的UI 

## 组合（Composition)
将两个或多个不同的抽象合并为一个

## 状态（state)
使用不可变的数据模型，把可以改变state的函数串联起来作为原点放置在顶层

## Memoization
创建一个函数的memorized版本，用来追踪最后一个参数和结果。这样如果继续使用同样的值，就不需要反复执行它了
```
function memoize(fn) {
  var cachedArg;
  var cachedResult;
  return function(arg) {
    if (cachedArg === arg) {
      return cachedResult;
    }
    cachedArg = arg;
    cachedResult = fn(arg);
    return cachedResult;
  };
}

var MemoizedNameBox = memoize(NameBox);

function NameAndAgeBox(user, currentTime) {
  return FancyBox([
    'Name: ',
    MemoizedNameBox(user.firstName + ' ' + user.lastName),
    'Age in milliseconds: ',
    currentTime - user.dateOfBirth
  ]);
}
```

## 列表（Lists)
Map

## 连续性(Continuations)


## State Map

## Memoization Map
使用一个集合来做memoization

```
function memoize(fn) {
  return function(arg, memoizationCache) {
    if (memoizationCache.arg === arg) {
      return memoizationCache.result;
    }
    const result = fn(arg);
    memoizationCache.arg = arg;
    memoizationCache.result = result;
    return result;
  };
}
```

## 代数效应（Algebraic Effects)

