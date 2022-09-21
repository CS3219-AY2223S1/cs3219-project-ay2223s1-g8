import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { URL_USER_SVC } from "../../utils/configs";

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(URL_USER_SVC, { username, password });
      const data = response.data;
      if (response.status === 201) {
        localStorage.setItem("token", data.token);
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
      //   localStorage.setItem("token", data.token);
      //   return data;
      // } else {
      //   return thunkAPI.rejectWithValue(data);
      // }
      localStorage.setItem("token", "sampe-token");
      return { username, userId: "userid12334", password };
    } catch (e) {
      console.log("Error: Unable to login user", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  },
);
