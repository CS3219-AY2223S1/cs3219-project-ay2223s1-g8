import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: "",
  difficulty: "",
  qid: "",
  isLeaving: false,
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
    setQid: (state, { payload }) => {
      state.qid = payload;
      return state;
    },
    setIsLeaving: (state, { payload }) => {
      state.isLeaving = payload;
      return state;
    },
  },
});

export const matchSelector = (state) => state.match;

export const { clearState, addMatchId, setDifficulty, setQid, setIsLeaving } = matchSlice.actions;

export default matchSlice.reducer;
