export default function createStore(reducer, preloadedState) {
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  };
}
