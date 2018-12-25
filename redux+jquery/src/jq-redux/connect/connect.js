import { wrapMapToPropsFunc } from "./wrapMapToProps";
import connectAdvanced from "../components/connectAdvanced";
import defaultSelectorFactory from "./selectorFactory";
import shallowEqual from "../utils/shallowEqual";

function strictEqual(a, b) {
  return a === b;
}

export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = wrapMapToPropsFunc,
  mapDispatchToPropsFactories = wrapMapToPropsFunc,
  selectorFactory = defaultSelectorFactory
} = {}) {
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    { areStatesEqual = strictEqual, areStatePropsEqual = shallowEqual } = {}
  ) {
    const initMapStateToProps = mapStateToPropsFactories(mapStateToProps);
    const initMapDispatchToProps = mapDispatchToPropsFactories(
      mapDispatchToProps
    );
    return connectHOC(selectorFactory, {
      initMapStateToProps,
      initMapDispatchToProps,
      areStatesEqual,
      areStatePropsEqual
    });
  };
}

export default createConnect();
