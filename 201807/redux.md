# redux

## createStore

    getState
    dispatch
    subscribe -> return unsubscribe
    replaceReducer

## react-redux

### connect

### mapStateToProps(state)

### mapDispatchToProps(dispatch)

### bindActionCreators(actionCreator, dispatch)

    ```
    return (args) => dispatch(actionCreator, (...args))
    ```

### compose

    ```
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
    ```

### combineReducers

### middleware, applyMiddleware

    action -> reducer
    store => next => action

### Provider

## 需要进一步理解

- http://www.redux.org.cn/docs/basics/UsageWithReact.html
  现在来创建一些容器组件把这些展示组件和 Redux 关联起来。技术上讲，容器组件就是使用 store.subscribe() 从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。你可以手工来开发容器组件，但建议使用 React Redux 库的 connect() 方法来生成，这个方法做了性能优化来避免很多不必要的重复渲染。（这样你就不必为了性能而手动实现 React 性能优化建议 中的 shouldComponentUpdate 方法。）
