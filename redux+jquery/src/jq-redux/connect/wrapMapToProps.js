import isPlainObject from "../utils/isPlainObject";
import { bindActionCreators } from "redux";
import warning from "../utils/warning";

export function wrapMapToPropsConstant(mapToProps, methodName) {
  if (mapDispatchToProps && typeof mapDispatchToProps === "object") {
    const getConstant = dispatch => bindActionCreators(mapToProps, dispatch);

    return function initConstantSelector(dispatch, options) {
      const constant = getConstant(dispatch);

      // function constantSelector() { return constant }
      // constantSelector.dependsOnOwnProps = false
      // return constantSelector
      return constant;
    };
  } else {
    warning(`${methodName}应该传入一个对象`);
    return;
  }
}

export function wrapMapToPropsFunc(mapToProps, methodName) {
  if (typeof mapToProps !== "function") {
    warning(`${methodName}应该传入一个函数`);
    return;
  }

  return function initProxySelector(dispatch, { displayName }) {
    const proxy = function mapToPropsProxy(stateOrDispatch) {
      return proxy.mapToProps(stateOrDispatch);
    };

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch) {
      proxy.mapToProps = mapToProps;
      let props = proxy(stateOrDispatch);

      // if (typeof props === 'function') {
      //     proxy.mapToProps = props
      //     props = proxy(stateOrDispatch, ownProps)
      // }

      if (process.env.NODE_ENV !== "production") {
        if (!isPlainObject(props)) {
          warning(
            `${methodName}() in ${displayName} must return a plain object. Instead received ${props}.`
          );
        }
      }

      return props;
    };

    return proxy;
  };
}
