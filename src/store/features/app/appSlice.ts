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
  chatLogs: ChatLog[];
  isDataLoaded: boolean;
  characters: Character[];
  isSmallScreen: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isSmallScreen: window.innerWidth < 768,
  isLeftPanelOpen: window.innerWidth >= 768,
  isSettingsOpen: false,
  currentlyViewing: {
    objectType: "",
    objectId: "",
  },
  socketConnection: null,
  chatLogs: [],
  isDataLoaded: false,
  characters: [],
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsSmallScreen: (state, action) => {
      state.isSmallScreen = action.payload;
    },
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
      state.chatLogs = action.payload.map((cl: ChatLog) => ({
        ...state.chatLogs.find((l) => l.threadId === cl.threadId),
        ...cl,
        chatLog: [
          ...(state.chatLogs.find((l) => l.threadId === cl.threadId)?.chatLog ??
            []),
          ...(cl.chatLog ?? []),
        ],
      }));
    },
    setChatLog: (state, action) => {
      const currentLog = state.chatLogs?.find(
        (log) => log.threadId === action.payload.threadId
      );
      if (currentLog) {
        currentLog.chatLog = action.payload.chatLog ?? currentLog.chatLog;
        currentLog.canSendMessage =
          action.payload.canSendMessage ?? currentLog.canSendMessage;
        currentLog.isLoading = action.payload.isLoading ?? currentLog.isLoading;
        currentLog.isInputAvailable =
          action.payload.isInputAvailable ?? currentLog.isInputAvailable;
        currentLog.type = action.payload.type ?? currentLog.type;
      } else {
        state.chatLogs.unshift({
          threadId: action.payload.threadId,
          chatLog: action.payload.chatLog,
          type: action.payload.type,
          isInputAvailable: true,
          isLoading: false,
        });
      }
    },
    addChatLog: (state, action) => {
      const currentLog = state.chatLogs?.find(
        (log) => log.threadId === action.payload.threadId
      );
      if (currentLog) {
        if (!currentLog.chatLog) currentLog.chatLog = [];
        if (!currentLog.type) currentLog.type = action.payload.type;
        if (!currentLog.title)
          currentLog.title =
            action.payload.title ?? `New ${action.payload.type}`;

        // if last message is already from "narrator", we concatenate
        if (
          currentLog.chatLog[currentLog.chatLog.length - 1]?.role ===
            "assistant" &&
          action.payload.role === "assistant"
        ) {
          currentLog.chatLog[currentLog.chatLog.length - 1].content +=
            action.payload.content;
        } else {
          currentLog.chatLog.push({
            id: action.payload.id,
            content: action.payload.content,
            role: action.payload.role,
          });
        }
      } else {
        if (!state.chatLogs) state.chatLogs = [];
        state.chatLogs.unshift({
          created_at: Date.now().toString(),
          threadId: action.payload.threadId,
          chatLog: [
            {
              id: action.payload.id,
              content: action.payload.content,
              role: action.payload.role,
              timestamp: Date.now().toString(),
              threadId: action.payload.threadId,
            },
          ],
          type: action.payload.type,
          title: `New ${action.payload.type}`,
        });
      }
    },
    setIsDataLoaded: (state, action) => {
      state.isDataLoaded = action.payload;
    },
    setCharacters: (state, action) => {
      state.characters = action.payload;
    },
    setCharacter: (state, action) => {
      const currentCharacter = state.characters?.find(
        (character) => character.threadId === action.payload.threadId
      );
      if (currentCharacter) {
        currentCharacter.name = action.payload.name ?? currentCharacter.name;
        currentCharacter.json = action.payload.json ?? currentCharacter.json;
        currentCharacter.isImageProcessing =
          action.payload.isImageProcessing ??
          currentCharacter.isImageProcessing;
        currentCharacter.isReportProcessing =
          action.payload.isReportProcessing ??
          currentCharacter.isReportProcessing;
        if (action.payload.newImage) {
          if (!currentCharacter.images)
            currentCharacter.images = [action.payload.newImage];
          else currentCharacter.images.unshift(action.payload.newImage);
        }
        currentCharacter.images =
          action.payload.images ?? currentCharacter.images;
      } else {
        state.characters.push({
          threadId: action.payload.threadId,
          name: action.payload.name,
          json: action.payload.json,
          images: action.payload.images
            ? action.payload.images
            : action.payload.newImage
            ? [action.payload.newImage]
            : [],
        });
      }
    },
  },
});

export const {
  setIsSmallScreen,
  toggleLeftPanel,
  toggleSettings,
  setCurrentlyViewing,
  setSocketConnection,
  setThreadTitle,
  setChatLogs,
  setChatLog,
  addChatLog,
  setIsDataLoaded,
  setCharacter,
  setCharacters,
} = appSlice.actions;

export default appSlice.reducer;
