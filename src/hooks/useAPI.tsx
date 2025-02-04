import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

import useCookie from "./useCookie";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeIsFromDataLoading,
  setCharacters,
  setChatLog,
  setChatLogs,
} from "../store/features/app/appSlice";
import useNewChatLocation from "./useNewChatLocation";
import { setScenarios } from "../store/features/games/gamesSlice";

const API_URL =
  process.env.NODE_ENV === "development" ||
  (window.location.origin !== "https://lola.la" &&
    window.location.origin !== "https://fabularius.ai")
    ? "https://devapi.fabularius.ai/dev"
    : "https://prodapi.fabularius.ai/prod";

const useAPI = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cookie = useCookie();
  const { mode } = useAppSelector((state) => state.app);
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
          cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching threads: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(removeIsFromDataLoading("threads"));
      dispatch(setChatLogs(data));
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
          cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching characters: ${response.statusText}`);
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
          cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        navigate(newChatLocation);
        throw new Error(`Error fetching messages: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(
        setChatLog({
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
          cookie,
          "ws-connection-id": connectionId ?? "",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching game scenarios: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("game scenarios", { data });
      dispatch(setScenarios(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getThreads,
    getCharacters,
    getMessages,
    getGameScenarios,
  };
};

export default useAPI;
