import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  isLeftPanelOpen: boolean;
  isSettingsOpen: boolean;
  currentlyViewing: {
    objectType: string;
    objectId: string | null;
  };
  socketConnection: WebSocket | null;
  chatLogs: {
    created_at: string;
    threadId: string;
    chatLog?: Message[];
    type: string;
    title?: string;
  }[];
  isDataLoaded: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isLeftPanelOpen: true,
  isSettingsOpen: false,
  currentlyViewing: {
    objectType: "",
    objectId: "",
  },
  socketConnection: null,
  chatLogs: [],
  isDataLoaded: false,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleLeftPanel: (state) => {
      state.isLeftPanelOpen = !state.isLeftPanelOpen;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setCurrentlyViewing: (state, action) => {
      state.currentlyViewing = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
    setThreadTitle: (state, action) => {
      const currentLog = state.chatLogs?.find(
        (log) => log.threadId === action.payload.threadId
      );
      if (currentLog) currentLog.title = action.payload.title;
    },
    setChatLogs: (state, action) => {
      state.chatLogs = action.payload;
    },
    setChatLog: (state, action) => {
      const currentLog = state.chatLogs?.find(
        (log) => log.threadId === action.payload.threadId
      );
      if (currentLog) currentLog.chatLog = action.payload.chatLog;
    },
    addChatLog: (state, action) => {
      const currentLog = state.chatLogs?.find(
        (log) => log.threadId === action.payload.threadId
      );
      if (currentLog) {
        if (!currentLog.chatLog) currentLog.chatLog = [];

        // if last message is already from "narrator", we concatenate
        if (
          currentLog.chatLog[currentLog.chatLog.length - 1].role ===
            "assistant" &&
          action.payload.role === "assistant"
        ) {
          currentLog.chatLog[currentLog.chatLog.length - 1].content +=
            action.payload.content;
        } else {
          currentLog.chatLog.push({
            content: action.payload.content,
            role: action.payload.role,
          });
        }
      } else {
        state.chatLogs.push({
          created_at: Date.now().toString(),
          threadId: action.payload.threadId,
          chatLog: [
            {
              content: action.payload.content,
              role: action.payload.role,
            },
          ],
          type: action.payload.type,
          title: action.payload.title,
        });
      }
    },
    setIsDataLoaded: (state, action) => {
      state.isDataLoaded = action.payload;
    },
  },
});

export const {
  toggleLeftPanel,
  toggleSettings,
  setCurrentlyViewing,
  setSocketConnection,
  setThreadTitle,
  setChatLogs,
  setChatLog,
  addChatLog,
  setIsDataLoaded,
} = appSlice.actions;

export default appSlice.reducer;
