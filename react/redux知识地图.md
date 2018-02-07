# redux

https://github.com/YutHelloWorld/Blog/issues/3

![redux](https://user-images.githubusercontent.com/20860159/29354186-429b4446-829f-11e7-9a2f-a15c97dafaa3.png)

## action & actionCreator
action creator 是负责构建action,并返回

```
const actionCreator = function(){
    return {
        type: 'AN_ACTION
    }
}
```
一般约定 action 是一个拥有 type 属性的对象。

```
console.log(actionCreator())
//  { type: 'AN_ACTION' }
```

## reducer
纯函数 ,接收state和action，返回修改后的新状态。Reducer 函数是 action 的订阅者。
