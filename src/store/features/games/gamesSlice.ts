import { createSlice } from "@reduxjs/toolkit";

import { Scenario } from "../../../types/games";
import { set } from "lodash";

// Define a type for the slice state
interface AppState {
  scenarios: Scenario[];
}

// Define the initial state using that type
const initialState: AppState = {
  scenarios: [],
};

export const gamesSlice = createSlice({
  name: "games",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setScenarios: (state, action) => {
      state.scenarios = action.payload;
    },
  },
});

export const { setScenarios } = gamesSlice.actions;

export default gamesSlice.reducer;
