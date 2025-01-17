import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UserState {
  settings: {
    language: string;
  };
  clickedUpvotes: string[];
  clickedDownvotes: string[];
}

// Define the initial state using that type
const initialState: UserState = {
  settings: {
    language: "auto",
  },
  clickedUpvotes: [],
  clickedDownvotes: [],
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
  },
});

export const { setSettings, setClickedDownvotes, setClickedUpvotes } =
  userSlice.actions;

export default userSlice.reducer;
