import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  isLeftPanelOpen: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isLeftPanelOpen: true,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleLeftPanel: (state) => {
      state.isLeftPanelOpen = !state.isLeftPanelOpen;
    },
  },
});

export const { toggleLeftPanel } = appSlice.actions;

export default appSlice.reducer;
