import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice";
import matchReducer from "./match/match.slice";
import socketReducer from "./socket/socket.slice";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("state", JSON.stringify(state, getCircularReplacer()));
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
    match: matchReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.socket"],
        // Ignore these paths in the state
        ignoredPaths: ["socket.socket"],
      },
    }),
  preloadedState: persistedStore,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
