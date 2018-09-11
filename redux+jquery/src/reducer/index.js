export const appReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_BODY":
      return Object.assign(state, { body: action.body });
    default:
      return state;
  }
};
