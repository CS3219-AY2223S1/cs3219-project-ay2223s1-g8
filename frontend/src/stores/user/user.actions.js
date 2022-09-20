import { createAsyncThunk } from "@reduxjs/toolkit";
import { URL_USER_SVC } from "../../utils/configs";

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await fetch(URL_USER_SVC, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      let data = await response.json();
      if (response.status === 201) {
        localStorage.setItem("token", data.token);
        return { ...data, username };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log("Error: Unable to sign up new user", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  },
);
