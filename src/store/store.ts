import {
  combineReducers,
  configureStore,
  UnknownAction,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

import appReducer from "./features/app/appSlice";
import gamesReducer from "./features/games/gamesSlice";
import userReducer from "./features/user/userSlice";
import socketReducer from "./features/socket/socketSlice";
import analyticsReducer from "./features/analytics/analyticsSlice";

// Flag to disable persistence temporarily
const PERSISTENCE_ENABLED = true;

// Create the root reducer
const rootReducer = combineReducers({
  app: appReducer,
  games: gamesReducer,
  user: userReducer,
  socket: socketReducer,
  analytics: analyticsReducer,
});

// Configure persistence options
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["socket"],
  migrate: (persistedState: any, currentVersion: number) => {
    if (persistedState && persistedState._persist.version === currentVersion) {
      return Promise.resolve({
        ...persistedState,
        app: {
          ...persistedState.app,
          isDataLoading: ["characters", "threads", "settings"],
          isDataLoaded: false,
          users: [],
        },
      });
    }
    // If no persisted state or version mismatch, return initial state
    return Promise.resolve(rootReducer(undefined, {} as UnknownAction));
  },
};

// Only apply persistence if enabled
const finalReducer = PERSISTENCE_ENABLED
  ? persistReducer(persistConfig, rootReducer)
  : rootReducer;

export const store = configureStore({
  reducer: finalReducer as typeof rootReducer,
  // You may need to adjust middleware:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/REGISTER",
          "persist/PURGE",
        ],
      },
    }),
});

// Create the persistor (will be a no-op if persistence is disabled)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
