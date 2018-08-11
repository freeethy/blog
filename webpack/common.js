// 同步加载
// 只能在node中使用
// require  module.exports
let fs = require('fs')
function req (moduleName) {
  let content = fs.readFileSync(moduleName, 'utf8')
  let fn = new Function(
    'exports',
    'module',
    'require',
    '__dirname',
    '__filename',
    content + '\n return module.exports'
  )

  let module = { exports: {} }

  return fn(module.exports, module, req, __dirname, __filename)
}
let content = req('./test.js')
console.log(content)

// 浏览器中执行
let module1 = { exports: {} }
;(function (module1, exports) {
  exports.fn = function () {
    console.log('common.js')
  }
})(module1, module1.exports)
let fn = module1.exports.fn
fn()
