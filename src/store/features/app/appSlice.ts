import { createSlice } from "@reduxjs/toolkit";
import { Games } from "../../../types/games";

// Define a type for the slice state
interface AppState {
  mode: "adult" | "minor";
  prevMode: "adult" | "minor";
  messagesSent: number;
  isLeftPanelOpen: boolean;
  isSettingsOpen: boolean;
  isLoginModalOpen: boolean;
  currentlyViewing: {
    objectType: string;
    objectId: string | null;
  };
  chatLogs: ChatLog[];
  isDataLoaded: boolean;
  isDataLoading: string[];
  isDataLoadingLeftPanel: string[];
  characters: Character[];
  isSmallScreen: boolean;
  games: Games[];
  stories: Story[];
  languages: Record<string, string>;
  explore: {
    latest: { thread: ChatLog; character?: Character; story?: Story }[];
    best: { thread: ChatLog; character?: Character; story?: Story }[];
  };
}

// Define the initial state using that type
const initialState: AppState = {
  mode: "minor",
  prevMode: "minor",
  messagesSent: 0,
  isSmallScreen: window.innerWidth < 768,
  isLeftPanelOpen: window.innerWidth >= 768,
  isSettingsOpen: false,
  isLoginModalOpen: false,
  currentlyViewing: {
    objectType: "",
    objectId: "",
  },
  chatLogs: [],
  isDataLoaded: false,
  isDataLoading: [],
  isDataLoadingLeftPanel: [],
  characters: [],
  games: [],
  stories: [],
  languages: {
    ar: "العربية",
    de: "Deutsch",
    en: "English",
    es: "Español",
    fr: "Français",
    hi: "हिन्दी",
    ja: "日本語",
    pt: "Português",
    ru: "Русский",
    sv: "Svenska",
    tr: "Türkçe",
    uk: "Українська",
  },
  explore: {
    latest: [],
    best: [],
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setExploreLatest: (state, action) => {
      state.explore.latest = action.payload;
    },
    setExploreBest: (state, action) => {
      state.explore.best = action.payload;
    },
    upvoteExplore: (state, action) => {
      const threadBest = state.explore.best.find(
        (t) => t.thread.threadId === action.payload
      );
      const threadLatest = state.explore.latest.find(
        (t) => t.thread.threadId === action.payload
      );
      if (threadBest)
        threadBest.thread.votes = (threadBest?.thread.votes ?? 0) + 1;
      if (threadLatest)
        threadLatest.thread.votes = (threadLatest?.thread.votes ?? 0) + 1;
    },
    downvoteExplore: (state, action) => {
      const threadBest = state.explore.best.find(
        (t) => t.thread.threadId === action.payload
      );
      const threadLatest = state.explore.latest.find(
        (t) => t.thread.threadId === action.payload
      );
      if (threadBest)
        threadBest.thread.votes = (threadBest?.thread.votes ?? 0) - 1;
      if (threadLatest)
        threadLatest.thread.votes = (threadLatest?.thread.votes ?? 0) - 1;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setPrevMode: (state, action) => {
      state.prevMode = action.payload;
    },
    messageSentPlusOne: (state) => {
      state.messagesSent++;
    },
    setIsSmallScreen: (state, action) => {
      state.isSmallScreen = action.payload;
    },
    toggleLeftPanel: (state) => {
      state.isLeftPanelOpen = !state.isLeftPanelOpen;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    toggleLoginModal: (state) => {
      state.isLoginModalOpen = !state.isLoginModalOpen;
    },
    setCurrentlyViewing: (state, action) => {
      state.currentlyViewing = action.payload;
    },
    setStory: (state, action) => {
      const currentStory = state.stories.find(
        (story) => story.threadId === action.payload.threadId
      );
      if (currentStory) {
        currentStory.image_search_results =
          action.payload.image_search_results ??
          currentStory.image_search_results;
        currentStory.characters =
          action.payload.characters ?? currentStory.characters;
        currentStory.isImageSearchProcessing =
          action.payload.isImageSearchProcessing ??
          currentStory.isImageSearchProcessing;
        currentStory.context = action.payload.context ?? currentStory.context;
      } else {
        state.stories.push({
          threadId: action.payload.threadId,
          image_search_results: action.payload.image_search_results,
          characters: action.payload.characters,
          context: action.payload.context,
          isImageSearchProcessing: action.payload.isImageSearchProcessing,
        });
      }
    },
    setGame: (state, action) => {
      const currentGame = state.games.find(
        (game) => game.threadId === action.payload.threadId
      );
      if (currentGame) {
        currentGame.heroActions =
          action.payload.heroActions ?? currentGame.heroActions;
        currentGame.heroActionsIsLoading =
          action.payload.heroActionsIsLoading ??
          currentGame.heroActionsIsLoading;
      } else {
        state.games.push(action.payload);
      }
    },
    deleteGame: (state, action) => {
      state.games = state.games.filter(
        (game) => game.threadId !== action.payload
      );
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
    deleteChatLog: (state, action) => {
      state.chatLogs = state.chatLogs.filter(
        (log) => log.threadId !== action.payload
      );
    },
    setChatLog: (state, action) => {
      if (!action.payload.threadId) return;
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
        currentLog.isBeingDeleted =
          action.payload.isBeingDeleted ?? currentLog.isBeingDeleted;
        currentLog.state = action.payload.state ?? currentLog.state;
        currentLog.isOwner = action.payload.isOwner ?? currentLog.isOwner;
      } else {
        state.chatLogs.unshift({
          threadId: action.payload.threadId,
          chatLog: action.payload.chatLog,
          type: action.payload.type,
          isInputAvailable: action.payload.isInputAvailable,
          canSendMessage: action.payload.canSendMessage,
          isLoading: action.payload.isLoading,
          state: action.payload.state,
          votes: 0,
          isOwner: action.payload.isOwner ?? true,
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
          votes: 0,
          isOwner: true,
        });
      }
    },
    setIsDataLoaded: (state, action) => {
      state.isDataLoaded = action.payload;
    },
    removeIsFromDataLoading: (state, action) => {
      state.isDataLoading = state.isDataLoading.filter(
        (i) => i !== action.payload
      );
    },
    setIsDataLoading: (state, action) => {
      state.isDataLoading = action.payload;
    },
    setIsDataLoadingLeftPanel: (state, action) => {
      state.isDataLoadingLeftPanel = action.payload;
    },
    setCharacters: (state, action) => {
      state.characters = action.payload;
    },
    deleteCharacter: (state, action) => {
      state.characters = state.characters.filter(
        (character) => character.threadId !== action.payload
      );
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

        if (action.payload.newImagesMultisize) {
          if (!currentCharacter.imagesMultisize)
            currentCharacter.imagesMultisize = [
              action.payload.newImagesMultisize,
            ];
          else
            currentCharacter.imagesMultisize.unshift(
              action.payload.newImagesMultisize
            );
        }
        currentCharacter.images =
          action.payload.images ?? currentCharacter.images;
        currentCharacter.imagesMultisize =
          action.payload.images_multisize ?? currentCharacter.imagesMultisize;
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
          imagesMultisize: action.payload.images_multisize
            ? action.payload.images_multisize
            : action.payload.newImagesMultisize
            ? [action.payload.newImagesMultisize]
            : [],
          isImageProcessing: action.payload.isImageProcessing,
          isReportProcessing: action.payload.isReportProcessing,
        });
      }
    },
  },
});

export const {
  setIsSmallScreen,
  toggleLeftPanel,
  toggleSettings,
  toggleLoginModal,
  setCurrentlyViewing,
  setThreadTitle,
  setChatLogs,
  setChatLog,
  addChatLog,
  setIsDataLoaded,
  setIsDataLoading,
  removeIsFromDataLoading,
  setIsDataLoadingLeftPanel,
  setCharacter,
  setCharacters,
  deleteCharacter,
  deleteChatLog,
  setGame,
  deleteGame,
  messageSentPlusOne,
  setStory,
  setMode,
  setPrevMode,
  setExploreBest,
  setExploreLatest,
  upvoteExplore,
  downvoteExplore,
} = appSlice.actions;

export default appSlice.reducer;
