const Common = {
  init(data) {
    return { type: "GET_IM_CONFIG", imconfig: data };
  },
  imRequest(data) {
    return { type: "IM_REQUEST", payload: data };
  }
};

export default Common;
