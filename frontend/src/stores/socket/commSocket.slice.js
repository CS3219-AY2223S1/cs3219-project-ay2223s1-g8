import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  commSocket: null,
};

export const commSocketSlice = createSlice({
  name: "commSocket",
  initialState,
  reducers: {
    clearCommState: () => {
      return initialState;
    },
    setCommSocket: (state, { payload }) => {
      state.commSocket = payload.commSocket;
      return state;
    },
  },
});

export const commSocketSelector = (state) => state.commSocket;

export const { clearCommState, setCommSocket } = commSocketSlice.actions;

export default commSocketSlice.reducer;
