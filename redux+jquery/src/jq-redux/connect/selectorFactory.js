import shallowEqual from "./../utils/shallowEqual";

export default function finalPropsSelectorFactory(
  dispatch,
  { initMapStateToProps, initMapDispatchToProps, ...options }
) {
  const mapStateToProps = initMapStateToProps(dispatch, options);
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options);

  let hasRunAtLeastOnce = false;
  let state;
  let stateProps;
  let dispatchProps;
  let mergedProps;

  function handleFirstCall(firstState) {
    state = firstState;
    stateProps = mapStateToProps(state);
    dispatchProps = mapDispatchToProps(dispatch);
    mergedProps = { ...stateProps, ...dispatchProps };
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewState() {
    const nextStateProps = mapStateToProps(state);
    const statePropsChanged = !shallowEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) mergedProps = { ...stateProps, ...dispatchProps };

    return mergedProps;
  }

  function handleSubsequentCalls(nextState) {
    const stateChanged = !shallowEqual(nextState, state);
    state = nextState;
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState)
      : handleFirstCall(nextState);
  };
}
