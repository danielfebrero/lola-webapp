import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface SocketState {
  socketConnection: WebSocket | null;
  connectionId: string | null;
}

// Define the initial state using that type
const initialState: SocketState = {
  socketConnection: null,
  connectionId: null,
};

export const socketSlice = createSlice({
  name: "socket",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
    setConnectionId: (state, action) => {
      state.connectionId = action.payload;
    },
  },
});

export const { setSocketConnection, setConnectionId } = socketSlice.actions;

export default socketSlice.reducer;
