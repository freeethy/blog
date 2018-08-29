const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const defaultOptions = {
  name: "@includehtml",
  root: "src"
};

module.exports = function(source) {
  // 异步
  const callback = this.async();
  // 获取传入的options
  let options = loaderUtils.getOptions(this);
  options = { ...defaultOptions, ...options };
  // 匹配 @includehtml(body.html)
  const reg = new RegExp(`${options.name}\\(([^)]+?)\\)`);
  let matches = source.match(reg);

  const handle = matches => {
    // 读取引用的模板文件进行替换
    fs.readFile(path.resolve(options.root, matches[1]), "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        source = source.replace(matches[0], data);
        matches = source.match(reg);
        if (matches) {
          handle(matches);
        } else {
          // 需要将html作为一个模块导出
          callback(err, `module.exports=${JSON.stringify(source)}`);
        }
      }
    });
  };

  handle(matches);
  // 调用callback需要return undefined
  return;
};
