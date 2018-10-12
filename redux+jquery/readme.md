# redux + jquery

有个项目是基于 jquery+observer(观察者模式)写的，现如今想要重构，看到一个相关的实现[如何在非 React 项目中使用 Redux](https://segmentfault.com/a/1190000009963395)，觉得不错，借鉴一下。

## 第一版实现

```javascript
const provider = store => mapStateToProps => Component => {
  /* 缓存 props 用来做计算 */
  let props;
  let component;
  const componentWrapper = () => {
    const newProps = mapStateToProps(store.getState());
    /* 如果新的结果和原来的一样，就不要重新渲染了 */
    if (shallowEqual(props, newProps)) return;
    props = newProps;
    if (!component) {
      component = new Component(props);
    } else {
      component.update(props);
    }
    component.render();
  };

  /* 监听数据变化重新渲染 */
  store.subscribe(componentWrapper);
  return componentWrapper;
};

export default provider;
```

## 第二版实现

模仿 react-redux 实现，和同事共同完成，代码详见 src。需要解决以下问题：

- component 生命周期
- component 修改 props 重新 render
- store 传入所有的 connect 包裹的组件,store.dispatch(action)时，比较 component 的 props 变化（subscribe），实现 component 级别的更新，而不是全局更新
- 子组件

### jq-component

- 和 react 类似的生命周期
- 通过 set props 实现 props 改变时执行 render、渲染
- render 返回字符串模板，渲染到通过 id 确定的 dom 节点中

### jq-redux

- 将 store 放在 connect 外层的闭包中，connect 中就可以取到 store 了

### 子组件 & componentWillUnmount

子组件放在父组件的 componentDidMount 和 componentDidUpdate 中执行，通过 new ChildComponent()实现重新渲染，渲染之前会执行子组件的 componentWillUnmount，具体逻辑在 component 组件内部，具体可看\_childWillUpdate，\_getAllChildren 会递归获取所有子组件，返回所有子组件数组，子组件倒序排列，然后执行所有子组件的 componentWillUnmount，并将子组件引用设置为 null

```javascript
getChildComponents() {
  return this.children;
}
componentDidMount() {
  this.renderChild();
}
componentDidUpdate() {
  this.renderChild();
}
renderChild(){
  this.children.head = new Head({
    domId: "head"
  });
}
```

### router

实现了一版 hashRouter

### 待添加的功能和需解决的问题

- 重构 component,考虑引入 jsx,dom-diff 处理渲染. 目前存在多次渲染的问题,严重影响性能,而且父子组件关系不是特别清晰,子组件的渲染有点乱
- 引入 immutable.js,处理不可变数据
- 引入 rxjs, redux-observable 处理复杂的逻辑
