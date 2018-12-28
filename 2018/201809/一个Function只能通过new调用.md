# 一个 Function 只能通过 new 调用

[babel 编译 class](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAEwPYFsDeBfIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=6.26.0&envVersion=)

```javascript
class component {}
```

以上代码通过 babel 编译后为：

```javascript
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var component = function component() {
  _classCallCheck(this, component);
};
```

注意编译后的代码中的这段，只能通过 new 调用:

```
if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
}
```
