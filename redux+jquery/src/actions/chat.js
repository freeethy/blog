const Chat = {
  imRequest(data) {
    return { type: "IM_REQUEST", payload: data };
  }
};

export default Chat;
