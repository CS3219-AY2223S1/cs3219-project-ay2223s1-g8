import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { URL_USER_SVC } from "../../utils/configs";
import { deleteToken, getToken, storeToken } from "../../utils/tokenUtils";

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(URL_USER_SVC, { username, password });
      const data = response.data;
      if (response.status === 201) {
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
      // TODO: uncomment after siqi updates the API endpoint
      // const response = await axios.post(URL_USER_SVC, { username, password });
      // const data = response.data;

      // if (response.status === 200) {
      //   storeToken(data.token);
      //   return data;
      // } else {
      //   return thunkAPI.rejectWithValue(data);
      // }
      storeToken("sampe-token");
      return { username, userId: "userid12334", password };
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
      const response = await axios.patch(URL_USER_SVC, {
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
    const response = await axios.delete(URL_USER_SVC, {
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