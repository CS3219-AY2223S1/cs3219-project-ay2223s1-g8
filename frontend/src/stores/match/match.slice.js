import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: "",
  difficulty: "",
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    clearState: () => {
      return initialState;
    },
    addMatchId: (state, { payload }) => {
      state.matchId = payload;
      return state;
    },
    setDifficulty: (state, { payload }) => {
      state.difficulty = payload;
      return state;
    },
  },
});

export const matchSelector = (state) => state.match;

export const { clearState, addMatchId, setDifficulty } = matchSlice.actions;

export default matchSlice.reducer;
