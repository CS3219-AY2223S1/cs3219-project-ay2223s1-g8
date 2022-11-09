import { createSlice } from "@reduxjs/toolkit";
import { deleteToken } from "../../utils/localStorageUtils";
import { signupUser, loginUser, changePassword, deleteUser } from "./user.actions";

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
      return state;
    },
    [signupUser.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
      return state;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.userId = payload.userId;
      state.username = payload.username;
      return state;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
      return state;
    },
    [changePassword.fulfilled]: (state) => {
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [changePassword.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [changePassword.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
      return state;
    },
    [deleteUser.fulfilled]: (state) => {
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [deleteUser.pending]: (state) => {
      state.isFetching = true;
      return state;
    },
    [deleteUser.rejected]: (state, { payload }) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = payload.message;
      return state;
    },
  },
});

export const userSelector = (state) => state.user;

export const { clearState, logoutUser } = userSlice.actions;

export default userSlice.reducer;
