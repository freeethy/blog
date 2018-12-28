# for in 和 for of

## for in

for...in 语句以任意顺序遍历一个对象的可枚举属性。对于每个不同的属性，语句都会被执行。
for...in 循环只遍历可枚举属性。像 Array 和 Object 使用内置构造函数所创建的对象都会继承自 Object.prototype 和 String.prototype 的不可枚举属性，例如 String 的 indexOf() 方法或 Object 的 toString()方法。循环将遍历对象本身的所有可枚举属性，以及对象从其构造函数原型中继承的属性（更接近原型链中对象的属性覆盖原型属性）

```
for (variable in object) {...}
```

## for of

for...of 语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句
对于 for...of 的循环，可以由 break, continue, throw 或 return 终止。在这些情况下，迭代器关闭。

```
for (variable of iterable) {
    //statements
}
```

for...in 语句以原始插入顺序迭代对象的可枚举属性。

for...of 语句遍历可迭代对象定义要迭代的数据。
