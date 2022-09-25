import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER_SVC_BASE_URL } from "../../utils/configs";
import { deleteToken, getToken, storeToken, storeUsername } from "../../utils/localStorageUtils";

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${USER_SVC_BASE_URL}/api/user`, { username, password });
      const data = response.data;
      if (response.status === 201) {
        storeUsername(username);
        storeToken(data.token);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log("Error: Unable to sign up new user", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  },
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${USER_SVC_BASE_URL}/api/session`, { username, password });
      const data = response.data;

      if (response.status === 200) {
        storeUsername(username);
        storeToken(data.token);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log("Error: Unable to login user", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  },
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ currPassword, newPassword }, thunkAPI) => {
    try {
      const response = await axios.patch(`${USER_SVC_BASE_URL}/api/user`, {
        token: getToken(),
        currPassword,
        newPassword,
      });
      const data = response.data;

      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log("Error: Unable to change password", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  },
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (thunkAPI) => {
  try {
    const response = await axios.delete(`${USER_SVC_BASE_URL}/api/user`, {
      data: {
        token: getToken(),
      },
    });
    const data = response.data;

    if (response.status === 200) {
      deleteToken();
      return data;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    console.log("Error: Unable to delete user", e.response.data);
    return thunkAPI.rejectWithValue(e.response.data);
  }
});
