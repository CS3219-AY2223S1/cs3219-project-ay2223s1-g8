import { createSlice } from "@reduxjs/toolkit";
import { signupUser } from "./user.actions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    userId: "",
    password: "",
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },
  extraReducers: {
    [signupUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.userId = payload.userId;
      state.username = payload.username;
    },
    [signupUser.pending]: (state) => {
      state.isFetching = true;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const userSelector = (state) => state.user;

export const { clearState } = userSlice.actions;

export default userSlice.reducer;
