export default function finalPropsSelectorFactory(
  dispatch,
  { initMapStateToProps, initMapDispatchToProps, ...options }
) {
  const mapStateToProps = initMapStateToProps(dispatch, options);
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options);

  // if (process.env.NODE_ENV !== "production") {
  //   verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName)
  // }

  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    dispatch,
    options
  );
}

function selectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  dispatch,
  { areStatesEqual, areStatePropsEqual }
) {
  let hasRunAtLeastOnce = false;
  let state;
  let stateProps;
  let dispatchProps;
  let mergedProps;

  //首次调用
  function handleFirstCall(firstState, props) {
    state = firstState;
    stateProps = mapStateToProps(state);
    dispatchProps = mapDispatchToProps(dispatch);
    mergedProps = { ...stateProps, ...dispatchProps, ...props };
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  //后续调用
  function handleSubsequentCalls(nextState, props) {
    //这里是一个静态比较
    const stateChanged = !areStatesEqual(nextState, state);
    state = nextState;

    if (stateChanged) return handleNewState(props);
    return mergedProps;
  }

  //处理新的state
  function handleNewState(props) {
    const nextStateProps = mapStateToProps(state);
    //判断传入当前组件props的这一部分子state对象是否有变化
    // 这里是一个浅比较
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged)
      mergedProps = { ...stateProps, ...dispatchProps, ...props };
    return mergedProps;
  }

  return function finalPropsSelector(nextState, props) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, props)
      : handleFirstCall(nextState, props);
  };
}
