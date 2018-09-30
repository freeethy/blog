export default class Component {
  isDidMounted = false;

  constructor(data) {
    this._prefix = "x_";

    if (!(data && data.domId)) {
      console && console.error && console.error(`组件创立需要domId属性`);
      new Error(`组件创立需要domId属性`);
    }

    this._domId = this._prefix + data.domId;
    this._dom = document.getElementById(this._prefix + data.domId);
    if (this._dom === null) {
      console &&
        console.error &&
        console.error(`不存在id为${this._domId}的dom元素`);
      new Error(`不存在id为${this._domId}的dom元素`);
    }

    if (data.props) {
      this._run(data.props);
    }
  }

  componentWillMount() {}

  componentWillUpdate() {}

  getChildComponents() {}

  render() {}

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  _getAllChildren(component, arr = []) {
    let children = null;

    let realComponent = component.wrappedComponent
      ? component.wrappedComponent
      : component;

    if (realComponent.getChildComponents) {
      let childComponents = realComponent.getChildComponents() || {};
      // 得到的是一个组件实例 Connect(Content)
      if (childComponents instanceof Component) {
        children = [childComponents];
      } else {
        // 得到的是组件对象 {content:Connect(Content)}
        let type = Object.prototype.toString.call(childComponents);
        if (type === "[object Array]" || type === "[object Object]") {
          children = Object.values(childComponents);
        } else {
          console.log(
            `${
              realComponent.constructor.name
            }'s getChildComponents should return a component or a object with component as values`
          );
        }
      }
    }

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
  _childWillUpdate(component) {
    // 递归得到所有子组件，顺序从子组件到父组件
    let children = this._getAllChildren(this);

    if (!children || (children && !children.length)) return;
    console.log(children, 111111);

    children.map(child => {
      child.componentWillUnmount && child.componentWillUnmount();
      child = null;
    });
    this.children = children = {};
  }

  _run(value) {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      console && console.error && console.error("props必须为一个对象");
      new Error("props必须为一个对象");
    }

    this._prop = value;

    if (!this.isDidMounted) {
      this.componentWillMount();
    } else {
      this.componentWillUpdate();
    }

    this._dom.innerHTML = this.render();

    this._childWillUpdate();

    if (!this.isDidMounted) {
      this.isDidMounted = true;
      this.componentDidMount();
    } else {
      this.componentDidUpdate();
    }
  }
  get props() {
    return this._prop;
  }

  set props(value) {
    this._run(value);
  }
}
