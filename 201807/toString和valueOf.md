# toString 和 valueOf

[一篇文章搞懂 toString() 和 valueOf()](https://blog.csdn.net/x_jagger/article/details/73430959)

## toString

[MDN: toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

表示该对象的字符串

每个对象都有一个 toString()方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString()方法被每个 Object 对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 "[object type]"，其中 type 是对象的类型。以下代码说明了这一点：

```
var o = new Object();
o.toString(); // returns "[object Object]"
```

可以自定义一个方法来取代默认的 toString() 方法。该 toString() 方法不能传入参数并且必须返回一个字符串。

可以通过 toString() 来获取每个对象的类型。为了每个对象都能通过 Object.prototype.toString() 来检测，需要以 Function.prototype.call() 或者 Function.prototype.apply() 的形式来调用，传递要检查的对象作为第一个参数，称为 thisArg。

```
var toString = Object.prototype.toString;

toString.call(new Date); // [object Date]
toString.call(new String); // [object String]
toString.call(Math); // [object Math]

//Since JavaScript 1.8.5
toString.call(undefined); // [object Undefined]
toString.call(null); // [object Null]

//其他类型的toString():
var x = [1,2,3];
x.toString(); //返回'1,2,3'

var x = function(){console.log('lalala')}
x.toString();// 返回'function(){console.log('lalala')}'

var x = 12345;
x.toString();// 返回'12345'
```

## valueOf

[MDN: valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

返回值为该对象的原始值。

JavaScript 调用 valueOf 方法将对象转换为原始值。你很少需要自己调用 valueOf 方法；当遇到要预期的原始值的对象时，JavaScript 会自动调用它。
默认情况下，valueOf 方法由 Object 后面的每个对象继承。 每个内置的核心对象都会覆盖此方法以返回适当的值。如果对象没有原始值，则 valueOf 将返回对象本身。

不同类型对象的 valueOf()方法的返回值

<table>
    <th>
        <td>对象</td>
        <td>返回值</td>
    </th>
    <tr>
        <td>Array</td>
        <td>返回数组对象本身。</td>
    </tr>
    <tr>
        <td>Boolean</td>
        <td>布尔值。</td>
    </tr>
    <tr>
        <td>Date</td>
        <td>存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC。</td>
    </tr>
    <tr>
        <td>Function</td>
        <td>函数本身。</td>
    </tr>
    <tr>
        <td>Number</td>
        <td>数字值。</td>
    </tr>
    <tr>
        <td>Object</td>
        <td>对象本身。这是默认情况。</td>
    </tr>
    <tr>
        <td>String</td>
        <td>字符串值。</td>
    </tr>
    <tr>
        <td></td>
        <td>Math 和 Error 对象没有 valueOf 方法。</td>
    </tr>
</table>

你可以在自己的代码中使用 valueOf 将内置对象转换为原始值。 创建自定义对象时，可以覆盖 Object.prototype.valueOf()来调用自定义方法，而不是默认 Object 方法。
