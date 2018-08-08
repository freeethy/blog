
(function (modules) {
    function require (moduleId) {
      var module = {
        exports: {}
      }
      modules[moduleId].call(module.exports, module, module.exports, require)
      return module.exports
    }
    return require(`./src/index.js`)
  })(
    {
        './src/index.js': (function (module, exports,require) {
            eval(`require('src/test.js')
require('src/index.css')
console.log('mywebpack')
module.exports = 'webpack打包'
`)
        })
      ,
        'src/test.js': (function (module, exports,require) {
            eval(`module.exports = '测试webpack'
`)
        })
      ,
        'src/index.css': (function (module, exports,require) {
            eval(`
        let style = document.createElement('style);
        style.innerText = "body{\n    background-color: #0f0;\n}";
        document.head.append(style);
    `)
        })
      
    }
  )
  