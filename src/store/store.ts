import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./features/app/appSlice";
import gamesReducer from "./features/games/gamesSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    games: gamesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
