import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UserState {
  settings: {
    language: string;
  };
  clickedUpvotes: string[];
  clickedDownvotes: string[];
  plan: string;
}

// Define the initial state using that type
const initialState: UserState = {
  settings: {
    language: "auto",
  },
  clickedUpvotes: [],
  clickedDownvotes: [],
  plan: "free",
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setClickedUpvotes: (state, action) => {
      state.clickedUpvotes = action.payload;
    },
    setClickedDownvotes: (state, action) => {
      state.clickedDownvotes = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = Object.assign(state.settings, action.payload);
    },
    setUserPlan: (state, action) => {
      state.plan = action.payload;
    },
  },
});

export const {
  setSettings,
  setClickedDownvotes,
  setClickedUpvotes,
  setUserPlan,
} = userSlice.actions;

export default userSlice.reducer;
