import { createSlice } from "@reduxjs/toolkit";

import { ImagesMultisize } from "../../../types/characters";

// Define a type for the slice state
interface UserState {
  settings: {
    user_id?: string;
    language: string;
    username?: string;
    profile_picture?: string;
  };
  clickedUpvotes: string[];
  clickedDownvotes: string[];
  plan: string;
  planValidUntil: string | null;
  images: {
    image_url: ImagesMultisize;
    thread_id: string;
    created_at: string;
  }[];
  quotas: {
    images_classic_plus: number;
  };

  isProfilePictureUpdating?: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  settings: {
    language: "auto",
  },
  clickedUpvotes: [],
  clickedDownvotes: [],
  plan: "free",
  planValidUntil: null,
  images: [],
  quotas: {
    images_classic_plus: 2,
  },
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProfilePictureIsUpdating: (state, action) => {
      state.isProfilePictureUpdating = action.payload;
    },
    setProfilePicture: (state, action) => {
      state.settings.profile_picture = action.payload;
    },
    setUsername: (state, action) => {
      state.settings.username = action.payload;
    },
    setId: (state, action) => {
      state.settings.user_id = action.payload;
    },
    reduceOneImageClassicPlus: (state) => {
      state.quotas.images_classic_plus -= 1;
    },
    setQuotas: (state, action) => {
      state.quotas = action.payload;
    },
    setMyImages: (state, action) => {
      state.images = action.payload;
    },

    setClickedUpvotes: (state, action) => {
      state.clickedUpvotes = action.payload;
    },
    setClickedDownvotes: (state, action) => {
      state.clickedDownvotes = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = Object.assign(state.settings, action.payload);
    },
    setUserPlan: (state, action) => {
      state.plan = action.payload.plan;
      state.planValidUntil = action.payload.plan_valid_until;
    },
  },
});

export const {
  setSettings,
  setClickedDownvotes,
  setClickedUpvotes,
  setUserPlan,
  setMyImages,
  setQuotas,
  reduceOneImageClassicPlus,
  setId,
  setUsername,
  setProfilePicture,
  setProfilePictureIsUpdating,
} = userSlice.actions;

export default userSlice.reducer;
