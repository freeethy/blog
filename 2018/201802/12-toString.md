# JavaScript toString() 函数详解

toString()函数用于将当前对象以字符串的形式返回。  
该方法属于Object对象，由于所有的对象都"继承"了Object的对象实例，因此几乎所有的实例对象都可以使用该方法。  
所有主流浏览器均支持该函数。  

## 语法
object.toString()

## 返回值
toString()函数的返回值为String类型。返回当前对象的字符串形式。  
JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。  

<table>
    <tr>
        <th>类型</th>
        <th>行为描述</th>
    </tr>
    <tr>
        <th>Array</th>
        <th>将 Array 的每个元素转换为字符串，并将它们依次连接起来，两个元素之间用英文逗号作为分隔符进行拼接</th>
    </tr>
    <tr>
        <th>Boolean</th>
        <th>如果布尔值是true，则返回"true"。否则返回"false"</th>
    </tr>
    <tr>
        <th>Date</th>
        <th>返回日期的文本表示</th>
    </tr>
    <tr>
        <th>Error</th>
        <th>返回一个包含相关错误信息的字符串</th>
    </tr>
    <tr>
        <th>Function</th>
        <th>返回如下格式的字符串，其中 functionname 是一个函数的名称，此函数的 toString 方法被调用： "function functionname() { [native code] }"</th>
    </tr>
    <tr>
        <th>Number</th>
        <th>返回数值的字符串表示。还可返回以指定进制表示的字符串，请参考Number.toString()</th>
    </tr>
    <tr>
        <th>String</th>
        <th>返回 String 对象的值</th>
    </tr>
    <tr>
        <th>Object</th>
        <th>返回"[object ObjectName]"，其中 ObjectName 是对象类型的名称</th>
    </tr>
</table>

## null、undefined
这两个没有toString方法


## toString和valueOf
[JS中 toString() & valueOf()](https://www.cnblogs.com/imwtr/p/4392041.html)

![javascript类型转换](https://images0.cnblogs.com/blog2015/688270/201504/041236070142565.png)  

一般来说，对象到字符串的转换经过了如下步骤：
1. 如果对象具有toString()方法，则调用这个方法。如果它返回一个原始值，js将这个值转换成字符串，并返还这个字符串结果。
2. 如果对象没有toString()方法，或者这个方法并不返回一个原始值，那么js将调用valueOf()方法。
3. 否则，js无法从toString()或者valueOf()获得一个原始值，因此这时它将抛出一个类型错误异常。

一般来说，对象到数字的转换过程中，js做了同样类似的事情，但这里它会首先尝试使用valueOf()方法：  
1. 如果对象具有valueOf()方法，后者返回一个原始值，则js将这个原始值转换成数字，并返回这个数字。
2. 否则，如果对象具有toString()方法，后者返回一个原始值，则js将转换并返回。
（首先js转换成相应的字符串原始值，再继续将这个原始值转换成相应的数字类型，再返回数字）
3. 否则，js抛出一个类型错误异常。

对象通过toString或valueOf方法转换为原始值，JS语言核心的内置类首先尝试使用valueOf()，再尝试使用toString()

对于所有非日期对象来说，对象到原始值的转换基本上是对象到数字的转换  
（首先调用valueOf,但日期对象则使用对象到字符串的转换模式，但这种转换只执行一次就立即被使用，不会像上面所说的那般 先转成字符串再转成相应的数字类型）  
比如说，js中“+"运算符可以进行数学加法和字符串连接操作。  
如果他它的其中一个操作数是对象，则js将使用特殊的方法将对象转换成原始值，而不是使用其他算术运算符的方法执行对象到数字的转换，”==“运算符类似  
和”==“一样，”<"与其他运算符也会做对象到原始值的转换，但要出去日期对象的特殊情形  
“-“减号运算符把两个操作数都转换成数字