import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice";

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("state", JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem("state");
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const persistedStore = loadFromLocalStorage();

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedStore,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
