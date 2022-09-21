import { createSlice } from "@reduxjs/toolkit";
import { deleteToken } from "../../utils/tokenUtils";
import { signupUser, loginUser, changePassword } from "./user.actions";

const initialState = {
  username: "",
  userId: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
    logoutUser: (state) => {
      state = initialState;
      deleteToken();
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
    [loginUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.userId = payload.userId;
      state.username = payload.username;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
    [changePassword.fulfilled]: (state) => {
      state.isFetching = false;
      state.isSuccess = true;
    },
    [changePassword.pending]: (state) => {
      state.isFetching = true;
    },
    [changePassword.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
    },
  },
});

export const userSelector = (state) => state.user;

export const { clearState, logoutUser } = userSlice.actions;

export default userSlice.reducer;
