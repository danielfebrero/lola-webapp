import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UserState {
  settings: {
    language: string;
  };
}

// Define the initial state using that type
const initialState: UserState = {
  settings: {
    language: "auto",
  },
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = Object.assign(state.settings, action.payload);
    },
  },
});

export const { setSettings } = userSlice.actions;

export default userSlice.reducer;
