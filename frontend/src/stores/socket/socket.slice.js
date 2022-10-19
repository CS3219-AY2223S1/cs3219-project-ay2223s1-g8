import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    clearState: () => {
      return initialState;
    },
    setSocket: (state, { payload }) => {
      state.userId = payload.userId;
      state.socket = payload.socket;
      return state;
    },
  },
});

export const socketSelector = (state) => state.socket;

export const { clearState, setSocket } = socketSlice.actions;

export default socketSlice.reducer;
