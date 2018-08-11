#! /usr/bin/env node

let entry = './src/index.js'
let output = './dist/main.js'
let fs = require('fs')
let ejs = require('ejs')
let path = require('path')
let script = fs.readFileSync(entry, 'utf8')
let modules = []
let styleLoader = function (source) {
  return `
        let style = document.createElement('style);
        style.innerText = ${JSON.stringify(source.replace(/\\r\\n/g, ''))};
        document.head.append(style);
    `
}

script = script.replace(/require\(['"](.+?)['"]\)/g, function () {
  let name = path.join('./src', arguments[1])
  let content = fs.readFileSync(name, 'utf8')
  if (/\.css$/.test(name)) {
    content = styleLoader(content)
  }
  modules.push({ name, content })
  return `require('${name}')`
})

let template = `
(function (modules) {
    function require (moduleId) {
      var module = {
        exports: {}
      }
      modules[moduleId].call(module.exports, module, module.exports, require)
      return module.exports
    }
    return require(\`<%-entry%>\`)
  })(
    {
        '<%-entry%>': (function (module, exports,require) {
            eval(\`<%-script%>\`)
        })
      <%for(let i=0;i<modules.length;i++){
        let module = modules[i];%>,
        '<%-module.name%>': (function (module, exports,require) {
            eval(\`<%-module.content%>\`)
        })
      <%}%>
    }
  )
  `

let result = ejs.render(template, { entry, script, modules })
fs.writeFileSync(output, result)
console.log('成功')
