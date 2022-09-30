import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: "",
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    clearState: (state) => {
      state.matchId = "";
      return state;
    },
    addMatchId: (state, { payload }) => {
      console.log(payload);
      state.matchId = payload;
      return state;
    },
  },
});

export const matchSelector = (state) => state.match;

export const { clearState, addMatchId } = matchSlice.actions;

export default matchSlice.reducer;
