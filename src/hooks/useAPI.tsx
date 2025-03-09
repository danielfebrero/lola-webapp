import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import i18n from "i18next";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import useCookie from "./useCookie";
import useNewChatLocation from "./useNewChatLocation";
import {
  removeIsFromDataLoading,
  archiveThread as archiveThreadAction,
  setArchivedThreads,
  setCharacter,
  setCharacters,
  setThread,
  setExplore,
  mergeUsers,
  mergeThreads,
} from "../store/features/app/appSlice";
import { setScenarios } from "../store/features/games/gamesSlice";
import { setAdminAnalytics } from "../store/features/analytics/analyticsSlice";
import {
  setMyImages,
  setProfilePictureIsUpdating,
  setQuotas,
  setSettings,
} from "../store/features/user/userSlice";
import { ImagesMultisize } from "../types/characters";
import { HTTP_API_DEV_URL, HTTP_API_PROD_URL } from "../utils/constants";
import {
  CharactersPariticipationType,
  PariticipationType,
} from "../types/chatGroup";

// Determine API URL based on environment and hostname
const API_URL = (() => {
  if (process.env.NODE_ENV === "development") return HTTP_API_DEV_URL;
  return ["https://fabularius.ai", "https://lola.la"].includes(
    window.location.origin
  )
    ? HTTP_API_PROD_URL
    : HTTP_API_DEV_URL;
})();

const useAPI = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cookie = useCookie();
  const { mode, exploreLanguage } = useAppSelector((state) => state.app);
  const { connectionId } = useAppSelector((state) => state.socket);
  const newChatLocation = useNewChatLocation();

  // Create standard request headers
  const getHeaders = (isFormData = false) => {
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      token:
        auth?.isAuthenticated && auth.user?.id_token ? auth.user?.id_token : "",
      madeleine: cookie,
      "ws-connection-id": connectionId ?? "",
    };
    return headers;
  };

  // Create URL with query parameters
  const createUrl = (endpoint: string, params: Record<string, any> = {}) => {
    const url = new URL(`${API_URL}${endpoint}`);

    // Add mode parameter to all requests
    if (mode) url.searchParams.append("mode", mode);

    // Add all other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    return url.toString();
  };

  // Generic API request handler
  const apiRequest = async <T,>(
    endpoint: string,
    options: RequestInit,
    params: Record<string, any> = {},
    navigateOnError = false
  ): Promise<any> => {
    try {
      const url = createUrl(endpoint, params);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return (await response.json()) as any;
    } catch (error) {
      console.error(`API Error with ${endpoint}:`, error);
      if (navigateOnError) navigate(newChatLocation);
      throw error;
    }
  };

  // GET request helper
  const apiGet = <T,>(endpoint: string, params = {}, navigateOnError = false) =>
    apiRequest<T>(
      endpoint,
      { method: "GET", headers: getHeaders() },
      params,
      navigateOnError
    );

  // POST request helper with JSON body
  const apiPost = <T,>(
    endpoint: string,
    body = {},
    params = {},
    navigateOnError = false
  ) =>
    apiRequest<T>(
      endpoint,
      { method: "POST", headers: getHeaders(), body: JSON.stringify(body) },
      params,
      navigateOnError
    );

  const apiDelete = <T,>(
    endpoint: string,
    body = {},
    params = {},
    navigateOnError = false
  ) =>
    apiRequest<T>(
      endpoint,
      {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify(body),
      },
      params,
      navigateOnError
    );

  // POST request helper with FormData body
  const apiPostFormData = <T,>(
    endpoint: string,
    formData: FormData,
    params = {},
    navigateOnError = false
  ) =>
    apiRequest<T>(
      endpoint,
      { method: "POST", headers: getHeaders(true), body: formData },
      params,
      navigateOnError
    );

  // API methods
  const getThreads = async () => {
    const data = await apiGet("/threads");
    dispatch(removeIsFromDataLoading("threads"));
    dispatch(mergeThreads(data));
  };

  const getCharacters = async () => {
    const data = await apiGet("/characters");
    dispatch(removeIsFromDataLoading("characters"));
    dispatch(setCharacters(data));
  };

  const getCharacter = async (threadId: string) => {
    const data = await apiGet("/character", { threadId });
    dispatch(
      setCharacter({
        ...data.data,
        thread_id: data.threadId,
        isReportProcessing: false,
        isImageProcessing: false,
      })
    );
    dispatch(
      setThread({
        chatLog: data.data.chatLog,
        threadId: data.threadId,
        isInputAvailable: true,
        isLoading: false,
        type: data.feature_type,
        isOwner: data.isOwner,
        is_private: data.is_private,
        votes: data.thread.votes,
      })
    );
  };

  const getMessages = async (threadId: string) => {
    const data = await apiGet("/messages", { threadId }, true);
    dispatch(
      setThread({
        chatLog: data.data,
        threadId: data.threadId,
        isInputAvailable: true,
        isLoading: false,
        type: data.feature_type,
        isOwner: data.isOwner,
        is_private: data.is_private,
      })
    );
  };

  const getMyImages = async () => {
    const data = await apiGet("/my-images", {}, true);
    dispatch(setMyImages(data));
  };

  const getGameScenarios = async () => {
    const data = await apiGet("/game_scenarios");
    dispatch(setScenarios(data));
  };

  const getExplore = async (exploreMode: string, exploreType: string) => {
    if (!exploreMode || !exploreType) return;
    const data = await apiGet("/explore", {
      exploreType,
      exploreMode,
      language: exploreLanguage,
    });
    dispatch(setExplore(data));
  };

  const getExploreImages = async (nextItem?: string) =>
    apiGet("/explore/images", { nextItem });

  const getAdminAnalytics = async (timewindow: string) => {
    const data = await apiGet("/analytics/admin", { timewindow });
    dispatch(setAdminAnalytics(data));
  };

  const getArchivedThreads = async () => {
    const data = await apiGet("/threads/archived");
    dispatch(setArchivedThreads(data));
  };

  const getQuotas = async () => {
    const data = await apiGet("/quotas");
    dispatch(setQuotas(data));
  };

  const setCharacterAvatar = async (
    threadId: string,
    avatar: ImagesMultisize
  ) => {
    const data = await apiPost("/character/avatar", { threadId, avatar });
    dispatch(
      setCharacter({
        avatar: data,
        thread_id: threadId,
      })
    );
  };

  const archiveThread = async (threadId: string) => {
    await apiPost("/thread/archive", { threadId });
    dispatch(archiveThreadAction(threadId));
  };

  const restoreThread = async (threadId: string) => {
    try {
      await apiPost("/thread/restore", { threadId });
    } catch (error) {
      dispatch(archiveThreadAction(threadId));
      throw error;
    }
  };

  const createChatGroup = async ({
    groupName,
    participants,
    isPublic,
    participation,
    characters,
    charactersParticipation,
    customParticipants,
  }: {
    groupName: string;
    participants: Record<string, any>;
    isPublic: boolean;
    participation: PariticipationType;
    characters: string[];
    charactersParticipation: CharactersPariticipationType;
    customParticipants: string[];
  }) => {
    return apiPost("/chat-groups", {
      groupName,
      participants: Object.keys(participants).map(
        (key) => participants[key].user_id
      ),
      isPublic,
      participation,
      characters,
      charactersParticipation,
      customParticipants,
      mode,
      language: i18n.language,
    });
  };

  const uploadCharacterImage = async (threadId: string, file: File) => {
    dispatch(setCharacter({ thread_id: threadId, isImageUploading: true }));

    try {
      const formData = new FormData();
      formData.append("threadId", threadId);
      formData.append("image", file);

      const data = await apiPostFormData("/character/image", formData);

      dispatch(
        setCharacter({
          avatar: data.avatar,
          imagesMultisize: data.imagesMultisize,
          thread_id: threadId,
          isImageUploading: false,
        })
      );
    } catch (error) {
      dispatch(setCharacter({ thread_id: threadId, isImageUploading: false }));
      throw error;
    }
  };

  const setUserProfilePicture = async (file: File) => {
    dispatch(setProfilePictureIsUpdating(true));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const data = await apiPostFormData("/user/profile-picture", formData);

      dispatch(setSettings({ profile_picture: data.imagesMultisize }));
      dispatch(setProfilePictureIsUpdating(false));
    } catch (error) {
      dispatch(setProfilePictureIsUpdating(false));
      throw error;
    }
  };

  const changeUsername = async (username: string) => {
    try {
      return await apiPost("/user/username", { username });
    } catch (error) {
      return { success: false };
    }
  };

  const getUsersDetails = async (users: string[]) => {
    const data = await apiGet("/users/details", { users });
    dispatch(mergeUsers(data));
    return data;
  };

  const getChatGroups = async (list: string) => {
    const data = await apiGet("/chat-groups", { list });
    return data;
  };

  const deleteChatGroup = async (threadId: string) => {
    await apiDelete("/chat-groups", { threadId });
  };

  return {
    getThreads,
    getCharacters,
    getCharacter,
    getMessages,
    getGameScenarios,
    getAdminAnalytics,
    getMyImages,
    getExplore,
    getExploreImages,
    setCharacterAvatar,
    uploadCharacterImage,
    archiveThread,
    getArchivedThreads,
    restoreThread,
    getQuotas,
    createChatGroup,
    setUserProfilePicture,
    changeUsername,
    getUsersDetails,
    getChatGroups,
    deleteChatGroup,
  };
};

export default useAPI;
