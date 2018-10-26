import { createCipher } from "crypto";

/**
 * 给节点设置属性
 * @param {*} dom   操作元素
 * @param {*} attr  操作元素属性
 * @param {*} value 操作元素值
 */
export function setAttribute(dom, attr, value) {
  if (attr === "className") {
    attr = "class";
  }
  if (attr.match("/onw+/")) {
    // 处理事件的属性:
    const eventName = attr.toLowerCase().splice(1);
    dom.addEventListener(eventName, value);
  } else if (attr === "style") {
    // 处理样式的属性:
    let styleStr = "";
    let standardCss;
    for (let klass in value) {
      standardCss = humpToStandard(klass); // 处理驼峰样式为标准样式
      styleStr += `${standardCss}: ${value[klass]};`;
    }
    dom.setAttribute(attr, styleStr);
  } else {
    // 其它属性
    dom.setAttribute(attr, value);
  }
}
