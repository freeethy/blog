export default class Component {
  isDidMounted = false;

  constructor(props) {
    // 不能取props，会循环赋值
    this.prop = {};
    this._prefix = "x_";
    console.log(props);
    if (props) {
      this._domId = this._prefix + props.domId;
      this._dom = document.getElementById(this._prefix + props.domId);
      if (this._dom === null) {
        console &&
          console.error &&
          console.error(`不存在id为${this._domId}的dom元素`);
        new Error(`不存在id为${this._domId}的dom元素`);
      }
    }
  }

  componentWillMount() {}

  componentWillUpdate() {}

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {}

  get props() {
    return this.prop;
  }

  set props(value) {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      console && console.error && console.error("props必须为一个对象");
      new Error("props必须为一个对象");
    }

    this.prop = value;

    if (!this.isDidMounted) {
      this.componentWillMount();
    } else {
      this.componentWillUpdate();
    }

    console.log(this._dom);
    if (this._dom) {
      this._dom.innerHTML = this.render();
    } else {
      this.render();
    }

    if (!this.isDidMounted) {
      this.isDidMounted = true;
      this.componentDidMount();
    } else {
      this.componentDidUpdate();
    }
  }
}
