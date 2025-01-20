import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AnalyticsState {
  admin: Record<string, any>;
}

// Define the initial state using that type
const initialState: AnalyticsState = {
  admin: {},
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAdminAnalytics: (state, action) => {
      state.admin = action.payload;
    },
  },
});

export const { setAdminAnalytics } = analyticsSlice.actions;

export default analyticsSlice.reducer;
