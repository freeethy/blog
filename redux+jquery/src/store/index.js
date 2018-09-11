import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { setStore } from "../jq-redux";
import { appReducer } from "../reducer";
import reduxIm from "./redux-im";

const initialState = {};
const store = createStore(
  appReducer,
  initialState,
  applyMiddleware(reduxIm, thunk)
);
setStore(store);
// window.store = store;

export default store;
