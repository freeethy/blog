/* 
 * redux中间件
 * 处理websocket请求
 */
export default store => next => action => {
  if (action.type == "IM_REQUEST") {
    let { to = 0, kind, message, sendCallback = () => {} } =
      action.payload || {};

    doSomeImRequest();
  } else {
    next(action);
  }
};
