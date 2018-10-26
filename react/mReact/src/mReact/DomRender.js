import { setAttribute } from "./utils";

function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  const { tagName, props, children } = vnode || {};

  if (vnode === undefined || vnode === null || typeof vnode === "boolean")
    vnode = "";

  if (typeof vnode === "number") vnode = String(vnode);

  if (typeof vnode === "string") {
    let textNode = document.createTextNode(vnode);
    return textNode;
  }

  if (typeof tagName === "function") {
    const component = createComponent(tagName, props);
    setComponentProps(component, props);
    return component.base;
  }

  let node = document.createElement(tagName);
  for (let attr in props) {
    setAttribute(node, attr, props[attr]);
  }

  // 递归渲染子节点
  children.forEach(child => render(child, node));

  return node;
}

// 创建组件
export function createComponent(component, props) {
  let inst;
  // 如果是类定义组件，则直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
    // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    };
  }

  return inst;
}

export function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;

  renderComponent(component);
}

export function renderComponent(component) {
  let base;

  const renderer = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base = _render(renderer);

  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }

  component.base = base;
  base._component = component;
}

const DomRender = render;
export default DomRender;
