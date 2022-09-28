import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/user.slice";
import matchReducer from "./match/match.slice";

export default configureStore({
  reducer: {
    user: userReducer,
    match: matchReducer,
  },
});
