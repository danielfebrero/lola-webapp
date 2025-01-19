import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

import appReducer from "./features/app/appSlice";
import gamesReducer from "./features/games/gamesSlice";
import userReducer from "./features/user/userSlice";
import socketReducer from "./features/socket/socketSlice";

// Create the root reducer
const rootReducer = combineReducers({
  app: appReducer,
  games: gamesReducer,
  user: userReducer,
  socket: socketReducer,
});

// Configure persistence options
const persistConfig = {
  key: "root",
  storage,
  // You can whitelist or blacklist reducers as needed:
  // whitelist: ['user'], // only user will be persisted
  blacklist: ["socket"], // counter will not be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
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

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
