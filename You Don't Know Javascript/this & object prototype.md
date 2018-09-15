# this & object prototype

[你不懂 JS: this 与对象原型](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes)

## this

this 不会以任何方式指向函数的 **词法作用域**。
this 不是编写时绑定，而是运行时绑定。它依赖于函数调用的上下文条件。
this 绑定与函数声明的位置没有任何关系，而与函数被调用的方式紧密相连。

this 既不是函数自身的引用，也不是函数 词法 作用域的引用。  
this 实际上是在函数被调用时建立的一个绑定，它指向 什么 是完全由函数被调用的调用点来决定的。

理解 this 必须理解调用点，即函数在代码中被调用的位置，而不是被声明的位置。
有 4 种规则，如下

### 默认绑定（Default Binding）

这种规则源于函数调用的最常见的情况：独立函数调用。

```javascript
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

### 隐含绑定（Implicit Binding）

调用点是否有一个环境对象（context object）  
当一个方法引用存在一个环境对象时，隐含绑定规则表示：这个对象应当被用于这个函数调用的 this 绑定。  
只有对象属性引用链的最后一层是影响调用点的。

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

obj.foo(); // 2
```

调用点使用 obj 环境来引用函数，所以可以说 obj 在函数被调用的时间点上“拥有”或“包含”这个函数引用。

#### 隐含丢失（Implicity Lost）

如果一个隐含绑定丢失了它的绑定，通常会退回到默认绑定，即全局对象或 undefined（受 strict mode 影响）。

```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};

var bar = obj.foo;
var a = "global"; // `a` 也是一个全局对象的属性

bar(); // "global"

function doFoo(fn) {
  fn();
}
doFoo(obj.foo); // "global"
```

参数传递仅仅是一种隐含的赋值，传递的函数是一个隐含的引用赋值

### 明确绑定（Explicit Binding）

接收的第一个参数都是一个用于 this 的对象，之后使用这个指定的 this 来调用函数。因为你已经直接指明你想让 this 是什么，所以我们称这种方式为 明确绑定（explicit binding)。

如 call,apply,bind

#### 硬绑定（Hard Binding）

bind(..) 返回一个硬编码的新函数，它使用你指定的 this 环境来调用原本的函数。

```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = foo.bind(obj);

var b = bar(3); // 2 3
console.log(b); // 5
```

#### API 调用的“环境”

### new 绑定（new Binding）

在 JS 中，构造器 仅仅是一个函数，它们偶然地与前置的 new 操作符一起调用。它们不依附于类，它们也不初始化一个类。它们甚至不是一种特殊的函数类型。它们本质上只是一般的函数，在被使用 new 来调用时改变了行为。

当在函数前面被加入 new 调用时，也就是构造器调用时，下面这些事情会自动完成：(详见[关于 Object 两三事--defineProperty，new, create](https://github.com/freeethy/blog/blob/master/201809/%E5%85%B3%E4%BA%8EObject%E4%B8%A4%E4%B8%89%E4%BA%8B--defineProperty%EF%BC%8Cnew%2C%20create.md))  
1.一个全新的对象会凭空创建（就是被构建）  
2.这个新构建的对象会被接入原形链（[[Prototype]]-linked）  
3.这个新构建的对象被设置为函数调用的 this 绑定  
4.除非函数返回一个它自己的其他 对象，否则这个被 new 调用的函数将 自动 返回这个新构建的对象。

### 规则顺序

明确绑定>隐含绑定>默认绑定
new>隐含绑定>默认绑定

new 和 call/apply 不能同时使用，所以 new foo.call(obj1) 是不允许的

bind 中允许 new 进行覆盖的部分是这里：

```javascript
this instanceof fNOP && oThis ? this : oThis;

// ... 和：

fNOP.prototype = this.prototype;
fBound.prototype = new fNOP();
```

### 判定 this

1.函数是通过 new 绑定，this 就是新构建的对象

```
var bar = new foo()
```

2.函数是通过 call 或 apply 被调用，或是使用 bind，this 就是那个被明确指定的对象

```
var bar = foo.call( obj2 )
```

3.函数是通过环境对象被调用的，隐含绑定，this 就是那个环境对象

```
var bar = obj1.foo()
```

4.以上都不是，则使用默认绑定。如果在 strict mode 下，就是 undefined，否则是 global 对象。

```
var bar = foo()
```

### 绑定的特例

#### 被忽略的 this

如果你传递 null 或 undefined 作为 call、apply 或 bind 的 this 绑定参数，那么这些值会被忽略掉，取而代之的是 默认绑定 规则将适用于这个调用。

#### 更安全的 this

完全为空的对象 的最简单方法就是 Object.create(null)。Object.create(null) 和 {} 很相似，但是没有指向 Object.prototype 的委托，所以它比 {} “空得更彻底”。

```javascript
function foo(a, b) {
  console.log("a:" + a + ", b:" + b);
}

// 我们的 DMZ 空对象
var ø = Object.create(null);

// 将数组散开作为参数
foo.apply(ø, [2, 3]); // a:2, b:3

// 用 `bind(..)` 进行 currying
var bar = foo.bind(ø, 2);
bar(3); // a:2, b:3
```

#### 间接

另外一个要注意的是，你可以（有意或无意地！）创建对函数的“间接引用（indirect reference）”，在那样的情况下，当那个函数引用被调用时，默认绑定 规则也会适用。

一个最常见的 间接引用 产生方式是通过赋值

### 词法 this

箭头函数（arrow-function），箭头函数从封闭它的（函数或全局）作用域采用 this 绑定。

```javascript
function foo() {
  // 返回一个箭头函数
  return a => {
    // 这里的 `this` 是词法上从 `foo()` 采用的
    console.log(this.a);
  };
}

var obj1 = {
  a: 2
};

var obj2 = {
  a: 3
};

var bar = foo.call(obj1);
bar.call(obj2); // 2, 不是3!
```

在 foo() 中创建的箭头函数在词法上捕获 foo() 被调用时的 this，不管它是什么。因为 foo() 被 this 绑定到 obj1，bar（被返回的箭头函数的一个引用）也将会被 this 绑定到 obj1。一个箭头函数的词法绑定是不能被覆盖的（就连 new 也不行！）。

## 对象

对象来自于两种形式：声明（字面）形式，和构造形式。  
在对象中，属性名 总是 字符串。如果你使用 string 以外的（基本）类型值，它会首先被转换为字符串。这甚至包括在数组中常用于索引的数字，所以要小心不要将对象和数组使用的数字搞混了。

参考[关于 Object 两三事--defineProperty，new, create](https://github.com/freeethy/blog/blob/master/201809/%E5%85%B3%E4%BA%8EObject%E4%B8%A4%E4%B8%89%E4%BA%8B--defineProperty%EF%BC%8Cnew%2C%20create.md)

## 混合（淆）“类”的对象

### 构造器（Constructor）

类的实例由类的一种特殊方法构建，这个方法的名称通常与类名相同，称为 “构造器（constructor）”。这个方法的具体工作，就是初始化实例所需的所有信息（状态）。
