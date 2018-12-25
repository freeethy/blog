import Logger from "Logger";
export default class Component {
  isDidMounted = false;
  lastProps = {};

  constructor(data) {
    this._prefix = "x_";
    this.children = {};

    if (!(data && data.domId)) {
      Logger && Logger.error && Logger.error(`组件创立需要domId属性`);
      new Error(`组件创立需要domId属性`);
    }

    this._domId = this._prefix + data.domId;
    this._dom = document.getElementById(this._domId);
    if (this._dom === null) {
      Logger &&
        Logger.error &&
        Logger.error(`不存在id为${this._domId}的dom元素`);
      // new Error(`不存在id为${this._domId}的dom元素`);
    }

    // TODO: 会在继承的组件super中执行,有问题
    // if (data.props) {
    //   this._run(data.props);
    // }
  }

  componentWillMount() {}

  componentWillUpdate() {}

  getChildComponents() {}

  render() {}

  renderChild() {}

  componentDidMount() {}

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  _getAllChildren(component, arr = []) {
    let children = null;

    let realComponent = component.wrappedComponent
      ? component.wrappedComponent
      : component;

    // if (realComponent.getChildComponents) {
    let childComponents = realComponent.children || {};
    // 得到的是一个组件实例 Connect(Content)
    if (childComponents instanceof Component) {
      children = [childComponents];
    } else {
      // 得到的是组件对象 {content:Connect(Content)}
      let type = Object.prototype.toString.call(childComponents);
      if (type === "[object Object]") {
        children = Object.values(childComponents);
      } else {
        console.log(
          `${
            realComponent.constructor.name
          }'s children should return a object with component as it's value`
        );
      }
    }
    // }

    children &&
      children.map(child => {
        if (!child) return;

        child = child.wrappedComponent ? child.wrappedComponent : child;
        if (child instanceof Component) {
          arr.unshift(child);
          arr = this._getAllChildren(child, arr);
        }
      });

    return arr;
  }

  // 子组件重新挂载或卸载
  _childWillUpdate() {
    // 递归得到所有子组件，顺序从子组件到父组件
    let children = this._getAllChildren(this);

    if (!children || (children && !children.length)) return;

    children.map(child => {
      child.componentWillUnmount && child.componentWillUnmount();
      if (child.unsubscribe) {
        child.unsubscribe();
        child.unsubscribe = null;
        child.dirty = true;
      }
      child._dom && (child._dom.innerHTML = "");
      return child;
    });
    this.children = {};
  }

  _run(value) {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      Logger && Logger.error && Logger.error("props必须为一个对象");
      // new Error("props必须为一个对象");
    }

    if (this.dirty) return;

    this._prop = value;

    if (!this.isDidMounted) {
      this.componentWillMount();
    } else {
      this.componentWillUpdate();
    }

    if (!this.isDidMounted || this.shouldComponentUpdate(this.lastProps)) {
      this._dom && (this._dom.innerHTML = this.render());
      this._childWillUpdate();

      this.renderChild();
    }

    if (!this.isDidMounted) {
      this.isDidMounted = true;
      this.componentDidMount();
    } else {
      if (this.shouldComponentUpdate(this.lastProps)) {
        this.componentDidUpdate();
      }
    }

    this.lastProps = value;
  }
  get props() {
    return this._prop;
  }

  set props(value) {
    this._run(value);
  }
}
