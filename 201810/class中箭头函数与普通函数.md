# class 中箭头函数与普通函数

```javascript
class component {
  constructor() {}
  A() {}
  B = () => {};
}
```

直接看 babel 编译后的结果, component.prototype.A, this.B

```javascript
"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var component = (function() {
  function component() {
    _classCallCheck(this, component);

    this.B = function() {};
  }

  _createClass(component, [
    {
      key: "A",
      value: function A() {}
    }
  ]);

  return component;
})();
```
