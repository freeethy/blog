# 关于 Object 两三事--defineProperty，new, create

## 前言

今天看到下面这个问题，挺有意思的，顺便理一下 Object 相关知识呀。

```javascript
function Person() {
  this.name = 2;
}

Object.defineProperty(Person.prototype, "name", {
  enumerable: false,
  value: 1
});
var a = new Person();
console.log(a); // 1
```

要回答上面的问题，先整理一下属性描述符以及 new Object()相关的知识

## Object.defineProperty()

[MDN-Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

Object.defineProperty(obj, prop, descriptor)方法会直接在一个对象上定义一个新属性，或者修改一个对象现有属性，并返回这个对象。

### 描述

该方法允许精确添加或修改对象的属性。通过赋值操作添加的普通属性是可枚举的，能够在属性枚举期间呈现出来（for...in 或 Object.keys 方法）， 这些属性的值可以被改变，也可以被删除。这个方法允许修改默认的额外选项（或配置）。默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改的。

### 属性描述符

对象里目前存在的属性描述符有两种主要形式：**数据描述符** 和 **存取描述符**。

- 数据描述符是一个具有值的属性，该值可能是可写的，也可能是不可写的。
- 存取描述符是由 getter-setter 函数对描述的属性。
- 描述符必须是这两种形式之一，不能同时是两者。

**数据描述符和存取描述符**均具有以下可选键值：

- **configurable** 当且仅当该属性的 configurable 为 true 时，该 _属性描述符_ 才能够被改变，同时该属性也能从对应的对象上被删除。**默认为 false**
- **enumerable** 当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。**默认为 false**

**数据描述符**同时具有以下可选键值：

- **value** 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
- **writable** 当且仅当该属性的 writable 为 true 时，value 才能被赋值运算符改变。默认为 false。

**存取描述符**同时具有以下可选键值：

- **get** 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入 this 对象（由于继承关系，这里的 this 并不一定是定义该属性的对象）。**默认为 undefined**。
- **set** 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。**默认为 undefined**。

```
{set prop(val) { . . . }}
{set [expression](val) { . . . }}
```

> 使用 set 语法时请注意以下事项：
>
> - 它可以有一个数字或字符串的标识符;
> - 它必须只有一个参数;
> - 它不得出现在具有另一个对象文字 set 或具有相同属性的数据条目的对象文字中。（{ set x(v) { }, set x(v) { } }并且{ x: ..., set x(v) { } }被禁止）

描述符可同时具有的键值  
| | configurable | enumerable | value |writable|get |set|  
|--|---------- |:----------:|------:|-------:|------:|------:|
|数据描述符| Yes | Yes | Yes |Yes |No | No|
|存取描述符| Yes | Yes | No |No |Yes |Yes|

> 如果一个描述符不具有 value,writable,get 和 set 任意一个关键字，那么它将被认为是一个数据描述符。如果一个描述符同时有(value 或 writable)和(get 或 set)关键字，将会产生一个异常。

**这些选项不一定是自身属性，如果是继承来的也要考虑。**

## new Object() 和 Object.create()

### new Object()

[MDN-new 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

当代码 new Foo(...) 执行时，会发生以下事情：  
1、一个继承自 Foo.prototype 的新对象被创建
2、使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象上。new Foo 等同于 new Foo()，也就是没有指定参数列表
3、由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显示返回一个对象，则使用步骤 1 创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

例子：

- 创建一个新对象，如：var person = {}
- 新对象的\_\_proto\_\_属性指向构造函数的原型对象
- 将构造函数的作用域赋值给新对象。（也所以 this 对象指向新对象）
- 执行构造函数内部的代码，将属性添加给 person 中的 this 对象
- 返回新对象 person

```javascript
var person = {};
person._proto_ = Person.prototype; //引用构造函数的原型对象
Person.call(person); //将构造函数的作用域给person,即：this值指向person

Function.method("new", function() {
  //新创建一个对象，它继承了构造器的原型对象。
  var that = Object.create(this.prototype); //此时，this 是指向 Function 构造器的。
  //调用构造器，绑定 this 对象到新对象 that 上
  var other = this.apply(that, argument); //此时，this 对象指向 that 对象。
  //如果它的返回值不是一个对象，就返回新的对象。
  return (typeof other === "object" && other) || that;
});
```

可以使用 Function.prototype 属性将共享属性添加到以前定义的对象类型。这定义了一个由该函数创建的所有对象共享的属性，而不仅仅是对象类型的其中一个实例。

### Object.create()

[MDN-Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的\_\_proto\_\_。

```
Object.create(proto, [propertiesObject])
```

- proto 新创建对象的原型对象。
- propertiesObject 可选。如果没有指定为 undefined，则是要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称。这些属性对应 Object.defineProperties()的第二个参数。

> 返回一个新对象，带着指定的原型对象和属性

```javascript
Object.create = function(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};
```

## call, apply, bind

### Function.prototype.call()

[MDN-Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

call() 方法调用一个函数, 其具有一个指定的 this 值和分别地提供的参数(参数的列表)。

```
fun.call(thisArg, arg1, arg2, ...)
```

- thisArg: 在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中就是 window 对象)，同时值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象。
- arg1, arg2, ...: 指定的参数列表。

> 返回值是你调用的方法的返回值，若该方法没有返回值，则返回 undefined。

### Function.prototype.apply()

[MDN-Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

apply() 方法调用一个具有给定 this 值的函数，以及作为一个数组（或类似数组对象）提供的参数。

```
func.apply(thisArg, [argsArray])
```

- thisArg: 可选的。在 func 函数运行时使用的 this 值。请注意，this 可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
- argsArray: 可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。如果该参数的值为 null 或 undefined，则表示不需要传入任何参数。从 ECMAScript 5 开始可以使用类数组对象。

> 返回值是调用有指定 this 值和参数的函数的结果。

apply 与 call() 非常相似，不同之处在于提供参数的方式。apply 使用参数数组而不是一组参数列表。apply 可以使用数组字面量（array literal），如 fun.apply(this, ['eat', 'bananas'])，或数组对象， 如 fun.apply(this, new Array('eat', 'bananas'))。

你也可以使用 arguments 对象作为 argsArray 参数。 arguments 是一个函数的局部变量。 它可以被用作被调用对象的所有未指定的参数。 这样，你在使用 apply 函数的时候就不需要知道被调用对象的所有参数。 你可以使用 arguments 来把所有的参数传递给被调用对象。 被调用对象接下来就负责处理这些参数。

从 ECMAScript 第 5 版开始，可以使用任何种类的类数组对象，就是说只要有一个 length 属性和(0..length-1)范围的整数属性。例如现在可以使用 NodeList 或一个自己定义的类似 {'length': 2, '0': 'eat', '1': 'bananas'} 形式的对象。

> 需要注意：Chrome 14 以及 Internet Explorer 9 仍然不接受类数组对象。如果传入类数组对象，它们会抛出异常。

### Function.prototype.bind()

[MDN-Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

bind()方法创建一个新的函数， 当这个新函数被调用时其 this 置为提供的值，其参数列表前几项置为创建时指定的参数序列。

```
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```

- thisArg: 调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用 new 运算符构造绑定函数，则忽略该值。当使用 bind 在 setTimeout 中创建一个函数（作为回调提供）时，作为 thisArg 传递的任何原始值都将转换为 object。如果没有提供绑定的参数，则执行作用域的 this 被视为新函数的 thisArg。
- arg1, arg2, ...: 当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。

> 返回由指定的 this 值和初始化参数改造的原函数拷贝

bind() 函数会创建一个新绑定函数，绑定函数与被调函数具有相同的函数体（在 ECMAScript 5 中）。调用绑定函数通常会导致执行包装函数。
绑定函数具有以下内部属性：

- [[BoundTargetFunction]] - 包装的函数对象
- [[BoundThis]] - 在调用包装函数时始终作为 this 值传递的值。
- [[BoundArguments]] - 一个值列表，其元素用作对包装函数的任何调用的第一个参数。
- [[Call]] - 执行与此对象关联的代码。通过函数调用表达式调用。内部方法的参数是一个 this 值和一个包含通过调用表达式传递给函数的参数的列表。

当调用绑定函数时，它调用[[BoundTargetFunction]]上的内部方法[[Call]]，后跟参数 Call(boundThis, args)。其中，bound 这是[[BoundThis]]，args 是[[BoundArguments]]，后跟函数调用传递的参数。

绑定函数也可以使用 new 运算符构造：这样做就好像已经构造了目标函数一样。提供的 this 值将被忽略，而前置参数将提供给模拟函数。

#### 创建绑定函数

bind() 最简单的用法是创建一个函数，使这个函数不论怎么调用都有同样的 this 值。

#### 偏函数

bind()的另一个最简单的用法是使一个函数拥有预设的初始参数。这些参数（如果有的话）作为 bind()的第二个参数跟在 this（或其他对象）后面，之后它们会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们的后面。

#### 配合 setTimeout

在默认情况下，使用 window.setTimeout() 时，this 关键字会指向 window （或全局）对象。当使用类的方法时，需要 this 引用类的实例，你可能需要显式地把 this 绑定到回调函数以便继续使用实例。

#### Polyfill

bind()函数在 ECMA-262 第五版才被加入；它可能无法在所有浏览器上运行。你可以部份地在脚本开头加入以下代码，就能使它运作，让不支持的浏览器也能使用 bind() 功能。

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function() {},
      fBound = function() {
        // this instanceof fNOP === true时,说明返回的fBound被当做new的构造函数调用
        return fToBind.apply(
          this instanceof fNOP ? this : oThis,
          // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

## 最后

defineProperty，writable 默认为 false，即 Person.prototype.name 不可写，JS 中属性的读取和设置是不同的，读取的时候按实例对象->原型对象->原型对象..的顺序查找，都找不到返回 undefined，而赋值时，首先在实例对象中寻找是否有属性,如果没有这个属性，那么就把这个属性添加到实例对象上；但是有例外，如果其原型链中有这个属性，但其为只读，那么就不会实例对象上添加这个新的属性，赋值操作无效如果其原型链中有这个属性，但其不为只读，那么就会在实例对象上添加这个新的属性。结合以上最开始的那个问题就很好理解了。

[你不懂 JS: this 与对象原型](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch5.md)

> myObject.foo = "bar" 赋值的三种场景，当 foo 不直接存在 于 myObject，但 存在 于 myObject 的 [[Prototype]] 链的更高层时：

> 如果一个普通的名为 foo 的数据访问属性在 [[Prototype]] 链的高层某处被找到，而且没有被标记为只读（writable:false），那么一个名为 foo 的新属性就直接添加到 myObject 上，形成一个 遮蔽属性。
> 如果一个 foo 在 [[Prototype]] 链的高层某处被找到，但是它被标记为 只读（writable:false） ，那么设置既存属性和在 myObject 上创建遮蔽属性都是 不允许 的。如果代码运行在 strict mode 下，一个错误会被抛出。否则，这个设置属性值的操作会被无声地忽略。不论怎样，没有发生遮蔽。
> 如果一个 foo 在 [[Prototype]] 链的高层某处被找到，而且它是一个 setter（见第三章），那么这个 setter 总是被调用。没有 foo 会被添加到（也就是遮蔽在）myObject 上，这个 foo setter 也不会被重定义。
