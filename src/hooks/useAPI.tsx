import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

import useCookie from "./useCookie";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeIsFromDataLoading,
  archiveThread as archiveThreadAction,
  setArchivedThreads,
  setCharacter,
  setCharacters,
  setThread,
  setThreads,
  setExplore,
} from "../store/features/app/appSlice";
import useNewChatLocation from "./useNewChatLocation";
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

const api_url_list = {
  "https://fabularius.ai": HTTP_API_PROD_URL,
  "https://lola.la": HTTP_API_PROD_URL,
  rest: HTTP_API_DEV_URL,
};

const API_URL =
  process.env.NODE_ENV === "development" ||
  !Object.keys(api_url_list).includes(window.location.origin)
    ? api_url_list.rest
    : api_url_list[window.location.origin as "https://fabularius.ai"];

const useAPI = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cookie = useCookie();
  const { mode, exploreLanguage } = useAppSelector((state) => state.app);
  const { connectionId } = useAppSelector((state) => state.socket);
  const newChatLocation = useNewChatLocation();

  const getThreads = async () => {
    try {
      const response = await fetch(`${API_URL}/threads?mode=${mode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching threads: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(removeIsFromDataLoading("threads"));
      dispatch(setThreads(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getCharacters = async () => {
    try {
      const response = await fetch(`${API_URL}/characters?mode=${mode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching characters: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(removeIsFromDataLoading("characters"));
      dispatch(setCharacters(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getCharacter = async (threadId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/character?threadId=${threadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token:
              auth?.isAuthenticated && auth.user?.id_token
                ? auth.user?.id_token
                : "",
            madeleine: cookie,
            "ws-connection-id": connectionId ?? "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching character: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
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
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getMessages = async (threadId: string) => {
    try {
      const response = await fetch(`${API_URL}/messages?threadId=${threadId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        navigate(newChatLocation);
        throw new Error(
          `Error fetching messages: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
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
      return;
    } catch (error) {
      navigate(newChatLocation);
      console.error(error);
      throw error;
    }
  };

  const getMyImages = async () => {
    try {
      const response = await fetch(`${API_URL}/my-images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        navigate(newChatLocation);
        throw new Error(
          `Error fetching messages: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(setMyImages(data));
      return;
    } catch (error) {
      navigate(newChatLocation);
      console.error(error);
      throw error;
    }
  };

  const getGameScenarios = async () => {
    try {
      const response = await fetch(`${API_URL}/game_scenarios?mode=${mode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching game scenarios: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(setScenarios(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getExplore = async (exploreMode: string, exploreType: string) => {
    if (!exploreMode || !exploreType) return;
    try {
      const response = await fetch(
        `${API_URL}/explore?exploreType=${exploreType}&exploreMode=${exploreMode}&mode=${mode}&language=${exploreLanguage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token:
              auth?.isAuthenticated && auth.user?.id_token
                ? auth.user?.id_token
                : "",
            madeleine: cookie,
            "ws-connection-id": connectionId ?? "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching explore: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(setExplore(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getExploreImages = async (nextItem?: string) => {
    try {
      let url = `${API_URL}/explore/images?mode=${mode}`;
      if (nextItem) url += `&nextItem=${nextItem}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching explore images: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getAdminAnalytics = async (timewindow: string) => {
    try {
      const response = await fetch(
        `${API_URL}/analytics/admin?timewindow=${timewindow}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token:
              auth?.isAuthenticated && auth.user?.id_token
                ? auth.user?.id_token
                : "",
            madeleine: cookie,
            "ws-connection-id": connectionId ?? "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching admin analytics: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(setAdminAnalytics(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const setCharacterAvatar = async (
    threadId: string,
    avatar: ImagesMultisize
  ) => {
    try {
      const response = await fetch(`${API_URL}/character/avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: JSON.stringify({ threadId, avatar }),
      });

      if (!response.ok) {
        throw new Error(
          `Error setting character avatar: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(
        setCharacter({
          avatar: data,
          thread_id: threadId,
        })
      );
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getArchivedThreads = async () => {
    try {
      const response = await fetch(`${API_URL}/threads/archived?mode=${mode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching admin analytics: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(setArchivedThreads(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getQuotas = async () => {
    try {
      const response = await fetch(`${API_URL}/quotas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching quotas: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(setQuotas(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const archiveThread = async (threadId: string) => {
    try {
      const response = await fetch(`${API_URL}/thread/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: JSON.stringify({ threadId }),
      });

      if (!response.ok) {
        throw new Error(
          `Error setting character avatar: ${JSON.stringify(response.json())}`
        );
      }

      dispatch(archiveThreadAction(threadId));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const restoreThread = async (threadId: string) => {
    try {
      const response = await fetch(`${API_URL}/thread/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: JSON.stringify({ threadId }),
      });

      if (!response.ok) {
        throw new Error(
          `Error setting character avatar: ${JSON.stringify(response.json())}`
        );
      }
      return;
    } catch (error) {
      dispatch(archiveThreadAction(threadId));
      console.error(error);
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
  }: {
    groupName: string;
    participants: string[];
    isPublic: boolean;
    participation: PariticipationType;
    characters: string[];
    charactersParticipation: CharactersPariticipationType;
  }) => {
    try {
      const response = await fetch(`${API_URL}/chat-group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: JSON.stringify({
          participants,
          groupName,
          isPublic,
          participation,
          characters,
          charactersParticipation,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error setting creating chat group: ${JSON.stringify(
            response.json()
          )}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const uploadCharacterImage = async (threadId: string, file: File) => {
    dispatch(
      setCharacter({
        thread_id: threadId,
        isImageUploading: true,
      })
    );
    try {
      const formData = new FormData();
      formData.append("threadId", threadId);
      formData.append("image", file);

      const response = await fetch(`${API_URL}/character/image`, {
        method: "POST",
        headers: {
          // Note: Do NOT set "Content-Type" manually with FormData; the browser sets it with the boundary
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Error uploading character image: ${JSON.stringify(response.json())}`
        );
      }

      const data = await response.json();
      dispatch(
        setCharacter({
          avatar: data.avatar,
          imagesMultisize: data.imagesMultisize,
          thread_id: threadId,
          isImageUploading: false,
        })
      );

      return;
    } catch (error) {
      console.error("Failed to upload character image:", error);
      dispatch(
        setCharacter({
          thread_id: threadId,
          isImageUploading: false,
        })
      );
      throw error;
    }
  };

  const setUserProfilePicture = async (file: File) => {
    dispatch(setProfilePictureIsUpdating(true));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/user/profile-picture`, {
        method: "POST",
        headers: {
          // Note: Do NOT set "Content-Type" manually with FormData; the browser sets it with the boundary
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Error uploading profile picture image: ${JSON.stringify(
            response.json()
          )}`
        );
      }

      const data = await response.json();
      dispatch(setSettings({ profile_picture: data.imagesMultisize }));
      dispatch(setProfilePictureIsUpdating(false));

      return;
    } catch (error) {
      console.error("Failed to upload profile picture image:", error);
      dispatch(setProfilePictureIsUpdating(false));
      throw error;
    }
  };

  const changeUsername = async (username: string) => {
    try {
      const response = await fetch(`${API_URL}/user/username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          madeleine: cookie,
          "ws-connection-id": connectionId ?? "",
        },
        body: JSON.stringify({
          username,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error setting changing username: ${JSON.stringify(response.json())}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
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
  };
};

export default useAPI;
