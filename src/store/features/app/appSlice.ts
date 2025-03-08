import { createSlice } from "@reduxjs/toolkit";
import { Games } from "../../../types/games";
import { Character, ImagesMultisize } from "../../../types/characters";
import { Story } from "../../../types/stories";
import { Thread } from "../../../types/chat";
import { ChatGroup } from "../../../types/chatGroup";

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
  chatLogs: Thread[];
  archivedThreads: Thread[];
  lastRequestIdWaitingForThreadId?: string | null;
  isDataLoaded: boolean;
  isDataLoading: string[];
  isDataLoadingLeftPanel: string[];
  characters: Character[];
  isSmallScreen: boolean;
  games: Games[];
  stories: Story[];
  chatGroups: ChatGroup[];
  languages: Record<string, string>;
  explore: {
    items: { thread: Thread; character?: Character; story?: Story }[];
    images: {
      items: ImagesMultisize[];
      isLoading: boolean;
    };
  };
  exploreLanguage: string;
  isCryptoPricingCheckoutUrlLoading: boolean;
  requestsStopped: string[];
  users: {
    user_id: string;
    profile_picture?: ImagesMultisize;
    username?: string;
  }[];
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
  archivedThreads: [],
  isDataLoaded: false,
  isDataLoading: ["characters", "threads", "settings"],
  isDataLoadingLeftPanel: [],
  characters: [],
  games: [],
  stories: [],
  chatGroups: [],
  languages: {},
  explore: {
    items: [],
    images: {
      items: [],
      isLoading: false,
    },
  },
  exploreLanguage: "all",
  isCryptoPricingCheckoutUrlLoading: false,
  lastRequestIdWaitingForThreadId: null,
  requestsStopped: [],
  users: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    mergeUsers: (state, action) => {
      for (const user of action.payload) {
        const existingUser = state.users.find(
          (u) => u.user_id === user.user_id
        );
        if (existingUser) {
          existingUser.profile_picture = user.profile_picture;
        } else {
          state.users.push(user);
        }
      }
    },
    setChatGroup: (state, action) => {
      state.chatGroups = state.chatGroups.filter(
        (group) => group.threadId !== action.payload.threadId
      );
      state.chatGroups.push(action.payload);
    },
    setChatGroups: (state, action) => {
      state.chatGroups = action.payload;
    },
    restoreArchivedThread: (state, action) => {
      const archivedThread = state.archivedThreads.find(
        (thread) => thread.threadId === action.payload
      );
      state.archivedThreads = state.archivedThreads.filter(
        (thread) => thread.threadId !== action.payload
      );
      if (archivedThread) {
        archivedThread.isBeingArchived = false;
        state.chatLogs.unshift(archivedThread);
      }
    },
    removeArchivedThread: (state, action) => {
      state.archivedThreads = state.archivedThreads.filter(
        (thread) => thread.threadId !== action.payload
      );
    },
    setArchivedThreads: (state, action) => {
      state.archivedThreads = action.payload;
    },
    archiveThread: (state, action) => {
      const thread = state.chatLogs.find(
        (log) => log.threadId === action.payload
      );
      state.chatLogs = state.chatLogs.filter(
        (log) => log.threadId !== action.payload
      );
      state.characters = state.characters.filter(
        (character) => character.thread_id !== action.payload
      );
      if (thread) state.archivedThreads.unshift(thread);
    },
    addImageToMessage: (
      state,
      action: {
        payload: {
          threadId: string;
          request_id: string;
          image: ImagesMultisize;
        };
      }
    ) => {
      const log = state.chatLogs?.find(
        (log: Thread) => log.threadId === action.payload.threadId
      );
      const message = log?.chatLog?.find(
        (m) =>
          m.request_id === action.payload.request_id && m.role === "assistant"
      );
      if (message) {
        message.images = message.images
          ? [...message.images, action.payload.image]
          : [action.payload.image];
      }
    },
    setIsCryptoCheckoutUrlLoading: (state, action) => {
      state.isCryptoPricingCheckoutUrlLoading = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
    resetExploreImages: (state) => {
      state.explore.images = {
        items: [],
        isLoading: false,
      };
    },
    appendExploreImages: (state, action) => {
      state.explore.images.items = [
        ...state.explore.images.items,
        ...action.payload.images,
      ];
    },
    setExploreImagesLoading: (state, action) => {
      state.explore.images.isLoading = action.payload;
    },
    setExploreLanguage: (state, action) => {
      state.exploreLanguage = action.payload;
    },
    setExplore: (state, action) => {
      state.explore.items = action.payload;
    },
    upvoteExplore: (state, action) => {
      const exploreThread = state.explore.items.find(
        (t) => t.thread.threadId === action.payload
      );
      if (exploreThread) {
        exploreThread.thread.votes = (exploreThread?.thread.votes ?? 0) + 1;
      }
      const thread = state.chatLogs.find((t) => t.threadId === action.payload);
      if (thread) {
        thread.votes = (thread?.votes ?? 0) + 1;
      }
    },
    downvoteExplore: (state, action) => {
      const exploreThread = state.explore.items.find(
        (t) => t.thread.threadId === action.payload
      );
      if (exploreThread) {
        exploreThread.thread.votes = (exploreThread?.thread.votes ?? 0) - 1;
      }
      const thread = state.chatLogs.find((t) => t.threadId === action.payload);
      if (thread) {
        thread.votes = (thread?.votes ?? 0) - 1;
      }
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
    setThreads: (state, action) => {
      state.chatLogs = action.payload.map((cl: Thread) => ({
        ...state.chatLogs.find((l) => l.threadId === cl.threadId),
        ...cl,
        isBeingArchived: false,
        isBeingDeleted: false,

        chatLog: [
          ...(state.chatLogs.find((l) => l.threadId === cl.threadId)?.chatLog ??
            []),
          ...(cl.chatLog ?? []),
        ],
      }));
    },
    deleteThread: (state, action) => {
      state.chatLogs = state.chatLogs.filter(
        (log) => log.threadId !== action.payload
      );
    },
    setThread: (state, action) => {
      if (!action.payload.threadId) return;
      const currentLog = state.chatLogs?.find(
        (log) => log.threadId === action.payload.threadId
      );
      if (currentLog) {
        currentLog.chatLog = action.payload.chatLog ?? currentLog.chatLog;
        currentLog.isRequestStopped =
          action.payload.isRequestStopped ?? currentLog.isRequestStopped;
        currentLog.lastRequestId =
          action.payload.lastRequestId ?? currentLog.lastRequestId;
        currentLog.canSendMessage =
          action.payload.canSendMessage ?? currentLog.canSendMessage;
        currentLog.isLoading = action.payload.isLoading ?? currentLog.isLoading;
        currentLog.isInputAvailable =
          action.payload.isInputAvailable ?? currentLog.isInputAvailable;
        currentLog.type = action.payload.type ?? currentLog.type;
        currentLog.isBeingDeleted =
          action.payload.isBeingDeleted ?? currentLog.isBeingDeleted;
        currentLog.isBeingArchived =
          action.payload.isBeingArchived ?? currentLog.isBeingArchived;
        currentLog.state = action.payload.state ?? currentLog.state;
        currentLog.isOwner = action.payload.isOwner ?? currentLog.isOwner;
        currentLog.is_private =
          action.payload.is_private ?? currentLog.is_private;
        currentLog.votes = action.payload.votes ?? currentLog.votes;
      } else {
        state.chatLogs.unshift({
          threadId: action.payload.threadId,
          chatLog: action.payload.chatLog,
          type: action.payload.type,
          isInputAvailable: action.payload.isInputAvailable,
          canSendMessage: action.payload.canSendMessage,
          isLoading: action.payload.isLoading,
          state: action.payload.state,
          votes: action.payload.votes ?? 0,
          isOwner: action.payload.isOwner ?? true,
          is_private: action.payload.is_private ?? false,
          lastRequestId: action.payload.lastRequestId ?? null,
          isRequestStopped: action.payload.isRequestStopped ?? false,
        });
      }
    },
    addThread: (state, action) => {
      const currentLog = state.chatLogs?.find(
        (log: Thread) => log.threadId === action.payload.threadId
      );
      if (currentLog) {
        if (!currentLog.chatLog) currentLog.chatLog = [];
        if (!currentLog.type) currentLog.type = action.payload.type;
        if (action.payload.is_private)
          currentLog.is_private = action.payload.is_private;
        if (!currentLog.title)
          currentLog.title =
            action.payload.title ?? `New ${action.payload.type}`;
        currentLog.lastRequestId =
          action.payload.lastRequestId ?? currentLog.lastRequestId;
        currentLog.isRequestStopped =
          action.payload.isRequestStopped ?? currentLog.isRequestStopped;

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
            image_gen_on: action.payload.image_gen_on,
            expected_image_count: action.payload.expected_image_count,
            images: action.payload.images ?? [],
            request_id: action.payload.request_id,
            user_id: action.payload.user_id,
            created_at: action.payload.created_at,
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
              created_at: Date.now().toString(),
              threadId: action.payload.threadId,
              image_gen_on: action.payload.image_gen_on,
              expected_image_count: action.payload.expected_image_count,
              request_id: action.payload.request_id,
            },
          ],
          type: action.payload.type,
          title: `New ${action.payload.type}`,
          votes: 0,
          isOwner: true,
          is_private: action.payload.is_private ?? false,
          lastRequestId: action.payload.lastRequestId,
          isRequestStopped: action.payload.isRequestStopped,
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
        (character) => character.thread_id !== action.payload
      );
    },
    setCharacter: (state, action) => {
      const currentCharacter = state.characters?.find(
        (character) => character.thread_id === action.payload.thread_id
      );
      if (currentCharacter) {
        currentCharacter.name = action.payload.name ?? currentCharacter.name;
        currentCharacter.json = action.payload.json ?? currentCharacter.json;
        currentCharacter.summary =
          action.payload.summary ?? currentCharacter.summary;
        currentCharacter.avatar =
          action.payload.avatar ?? currentCharacter.avatar;
        currentCharacter.isImageProcessing =
          action.payload.isImageProcessing ??
          currentCharacter.isImageProcessing;
        currentCharacter.isReportProcessing =
          action.payload.isReportProcessing ??
          currentCharacter.isReportProcessing;
        currentCharacter.isImageUploading =
          action.payload.isImageUploading ?? currentCharacter.isImageUploading;
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
          action.payload.imagesMultisize ?? currentCharacter.imagesMultisize;
      } else {
        state.characters.push({
          thread_id: action.payload.thread_id,
          name: action.payload.name,
          json: action.payload.json,
          images: action.payload.images
            ? action.payload.images
            : action.payload.newImage
            ? [action.payload.newImage]
            : [],
          imagesMultisize: action.payload.imagesMultisize
            ? action.payload.imagesMultisize
            : action.payload.newImagesMultisize
            ? [action.payload.newImagesMultisize]
            : [],
          isImageProcessing: action.payload.isImageProcessing,
          isReportProcessing: action.payload.isReportProcessing,
          isImageUploading: action.payload.isImageUploading,
          avatar: action.payload.avatar,
          summary: action.payload.summary,
        });
      }
    },
    setLastRequestWaitingForThreadId: (state, action) => {
      state.lastRequestIdWaitingForThreadId = action.payload;
    },
    addRequestStopped: (state, action) => {
      state.requestsStopped
        ? state.requestsStopped.push(action.payload)
        : (state.requestsStopped = [action.payload]);
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
  setThreads,
  setThread,
  addThread,
  setIsDataLoaded,
  setIsDataLoading,
  removeIsFromDataLoading,
  setIsDataLoadingLeftPanel,
  setCharacter,
  setCharacters,
  deleteCharacter,
  deleteThread,
  setGame,
  deleteGame,
  messageSentPlusOne,
  setStory,
  setMode,
  setPrevMode,
  setExplore,
  resetExploreImages,
  appendExploreImages,
  setExploreImagesLoading,
  upvoteExplore,
  downvoteExplore,
  setExploreLanguage,
  setLanguages,
  setIsCryptoCheckoutUrlLoading,
  setLastRequestWaitingForThreadId,
  addRequestStopped,
  addImageToMessage,
  archiveThread,
  setArchivedThreads,
  removeArchivedThread,
  restoreArchivedThread,
  setChatGroup,
  setChatGroups,
  mergeUsers,
} = appSlice.actions;

export default appSlice.reducer;
