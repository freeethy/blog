// 可直接在浏览器中执行
// define require

let factories = {}
function define (moduleName, dependencies, factory) {
  factory.dependencies = dependencies
  factories[moduleName] = factory
}

function require (modules, callback) {
  let result = modules.map(function (module) {
    let factory = factories[module]
    let exports
    let dependencies = factory.dependencies
    require(dependencies, function () {
      exports = factory.apply(null, arguments)
    })
    return exports
  })
  callback.apply(null, result)
}

define('a', [], function () {
  return 1
})
define('b', [], function () {
  return 2
})
define('c', ['a'], function (a) {
  return a + 3
})

require(['a', 'b'], function (a, b) {
  console.log(a, b)
})

require(['c'], function (c) {
  console.log(c)
})
