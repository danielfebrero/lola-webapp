import { useEffect } from "react";
import i18n from "i18next";
import { useAuth } from "react-oidc-context";
import { useNavigate, useSearchParams } from "react-router";
import { track } from "@vercel/analytics/react";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  addChatLog,
  setChatLogs,
  setChatLog,
  setThreadTitle,
  setCharacter,
  setCharacters,
  deleteChatLog,
  deleteCharacter as deleteCharacterAction,
  setGame,
  deleteGame,
  messageSentPlusOne,
  setStory,
  removeIsFromDataLoading,
  setExploreLatest,
  setExploreBest,
} from "../store/features/app/appSlice";
import {
  setClickedDownvotes,
  setClickedUpvotes,
  setSettings as setSettingsAction,
} from "../store/features/user/userSlice";
import useGA from "./useGA";
import useNewChatLocation from "./useNewChatLocation";
import { set } from "lodash";

export default function useWebSocket({
  setThreadId,
}: {
  setThreadId?: (threadId: string) => void;
}) {
  const auth = useAuth();
  const newChatLocation = useNewChatLocation();
  const { currentlyViewing, mode } = useAppSelector((state) => state.app);
  const { socketConnection } = useAppSelector((state) => state.socket);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sendEvent } = useGA();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.action) {
          case "fetch":
            switch (data.type) {
              case "clicked_votes":
                dispatch(setClickedUpvotes(data.data.upvotes));
                dispatch(setClickedDownvotes(data.data.downvotes));
                break;
              case "explore_latest":
                dispatch(setExploreLatest(data.data));
                break;
              case "explore_best":
                dispatch(setExploreBest(data.data));
                break;
              case "settings":
                dispatch(removeIsFromDataLoading("settings"));
                dispatch(setSettingsAction(data.data));
                break;
              case "story":
                console.log({ data });
                dispatch(
                  setStory({
                    threadId: data.threadId,
                    ...data.data,
                  })
                );
                break;

              case "image_search":
                switch (data.status) {
                  case "init":
                    dispatch(
                      setStory({
                        threadId: data.threadId,
                        isImageSearchProcessing: true,
                      })
                    );
                    break;

                  case "done":
                    dispatch(
                      setStory({
                        threadId: data.threadId,
                        isImageSearchProcessing: false,
                        image_search_results: data.data,
                      })
                    );
                    break;
                }
                break;
              case "chat":
                switch (data.status) {
                  case "complete":
                    // Handle logic for when chat generation is complete
                    if (data.threadId && data.feature_type === "character") {
                      dispatch(
                        setCharacter({
                          threadId: data.threadId,
                          isReportProcessing: true,
                          isImageProcessing: true,
                        })
                      );
                    }

                    if (
                      data.threadId &&
                      data.feature_type === "you_are_the_hero"
                    ) {
                      dispatch(
                        setGame({
                          heroActionsIsLoading: true,
                          threadId: data.threadId,
                        })
                      );
                    }

                    dispatch(
                      setChatLog({
                        threadId: data.threadId,
                        isInputAvailable: true,
                        canSendMessage: true,
                        state: data.status,
                      })
                    );
                    break;
                  case "done":
                    // Handle logic for when chat generation is done
                    if (data.threadId && data.feature_type === "character") {
                      dispatch(
                        setCharacter({
                          threadId: data.threadId,
                          isReportProcessing: false,
                          isImageProcessing: false,
                        })
                      );
                    }
                    break;
                  case "partial":
                    // Add assistant's message to the chat log
                    dispatch(
                      addChatLog({
                        threadId: data.threadId,
                        canSendMessage: false,
                        isInputAvailable: true,
                        content: data.content,
                        type: data.feature_type,
                        role: "assistant",
                        state: data.status,
                      })
                    );
                    break;
                  case "init":
                    if (setThreadId) setThreadId(data.threadId);
                    dispatch(
                      setChatLog({
                        threadId: data.threadId,
                        isInputAvailable: true,
                        canSendMessage: false,
                        state: data.status,
                      })
                    );
                    break;
                  default:
                    console.warn("Unhandled chat status:", data.status);
                }
                break;

              case "threads":
                dispatch(removeIsFromDataLoading("threads"));
                dispatch(setChatLogs(data.data));
                break;

              case "character":
                dispatch(
                  setCharacter({
                    threadId: data.threadId,
                    isReportProcessing: false,
                    isImageProcessing: false,
                    ...data.data,
                  })
                );
                break;

              case "json_character_generation":
                dispatch(
                  setCharacter({
                    threadId: data.threadId,
                    isReportProcessing: false,
                    isImageProcessing: !data.error,
                    ...data.data,
                  })
                );
                break;

              case "characters":
                dispatch(removeIsFromDataLoading("characters"));
                dispatch(setCharacters(data.data));
                break;

              case "thread_title":
                dispatch(
                  setThreadTitle({ threadId: data.threadId, title: data.title })
                );
                break;

              case "image_generation":
                dispatch(
                  setCharacter({
                    threadId: data.threadId,
                    newImage: data.s3Url,
                    newImagesMultisize: data.s3Urls,
                    isImageProcessing: false,
                  })
                );
                break;

              case "messages":
                if (data.errorCode === "503") navigate(newChatLocation);
                dispatch(
                  setChatLog({
                    chatLog: data.data,
                    threadId: data.threadId,
                    isInputAvailable: true,
                    isLoading: false,
                    type: data.feature_type,
                    isOwner: data.isOwner,
                  })
                );
                break;

              case "hero_actions":
                if (data.status === "init") {
                  dispatch(
                    setGame({
                      heroActionsIsLoading: true,
                      threadId: data.threadId,
                    })
                  );
                } else {
                  dispatch(
                    setGame({
                      heroActions: data.data.actions,
                      heroActionsIsLoading: data.data.is_generating ?? false,
                      threadId: data.threadId,
                    })
                  );
                }
                break;

              case "error":
                console.error("Error from server:", data.error);
                break;

              default:
                console.warn("Unhandled message type:", data.type);
            }
            break;

          case "delete":
            switch (data.type) {
              case "story":
                if (data.success) {
                  if (
                    currentlyViewing.objectType === "story" &&
                    currentlyViewing.objectId === data.threadId
                  )
                    navigate("/story/new");
                  dispatch(deleteChatLog(data.threadId));
                }

                break;
              case "character":
                if (data.success) {
                  if (
                    currentlyViewing.objectType === "character" &&
                    currentlyViewing.objectId === data.threadId
                  )
                    navigate("/character/new");

                  dispatch(deleteCharacterAction(data.threadId));
                  dispatch(deleteChatLog(data.threadId));
                }
                break;

              case "you_are_the_hero":
                if (data.success) {
                  if (
                    currentlyViewing.objectType === "game" &&
                    currentlyViewing.objectId === data.threadId
                  )
                    navigate("/game/new");

                  dispatch(deleteGame(data.threadId));
                  dispatch(deleteChatLog(data.threadId));
                }
                break;

              default:
                console.warn("Unhandled delete type:", data.type);
            }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message", event.data, err);
      }
    };
  }, [
    socketConnection,
    dispatch,
    setThreadId,
    currentlyViewing.objectType,
    currentlyViewing.objectId,
    navigate,
    newChatLocation,
  ]);

  const sendMessage = (
    message: string,
    endpoint: string,
    threadId: string | null,
    extraFields?: Record<string, any>
  ) => {
    track("sent_message");
    sendEvent("send_message_" + endpoint, endpoint);

    dispatch(messageSentPlusOne());

    // Add user's message to the chat log
    if (threadId) dispatch(setChatLog({ threadId, canSendMessage: false }));
    if (threadId)
      dispatch(
        addChatLog({
          threadId,
          content: message,
          role: "user",
          type: endpoint,
        })
      );

    // Send the action via WebSocket
    const msg: Record<string, any> = {
      action: "generateText",
      endpoint: endpoint,
      input_text: message,
      language: i18n.language,
      mode,
      admin: searchParams.get("admin"),
      token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      ...extraFields,
    };

    if (threadId) msg.threadId = threadId; // Include threadId if it exists

    socketConnection?.send(JSON.stringify(msg));
  };

  const initData = () => {
    console.log("Fetching initData");
    getThreads();
    getCharacters();
    getSettings();
  };

  const getThreads = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "threads",
        mode,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getThreadChatLog = (threadId: string) => {
    console.log("Fetching chatLog for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "messages",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getCharacter = (threadId: string) => {
    console.log("Fetching Character for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "character",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getCharacters = () => {
    console.log("Fetching Characters");
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "characters",
        mode,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const deleteCharacter = (threadId: string) => {
    console.log("Deleting Character for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({
        action: "deleteData",
        endpoint: "character",
        threadId,
        admin: searchParams.get("admin"),
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getHeroActions = (threadId: string) => {
    console.log("Fetching Hero Actions");
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "hero_actions",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const deleteHeroGame = (threadId: string) => {
    console.log("Deleting Hero Game for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({
        action: "deleteData",
        endpoint: "you_are_the_hero",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const deleteStory = (threadId: string) => {
    console.log("Deleting story for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({
        action: "deleteData",
        endpoint: "story",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getStory = (threadId: string) => {
    console.log("Fetching Story for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "story",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getSettings = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "settings",
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const setSettings = (settings: Record<string, any>) => {
    socketConnection?.send(
      JSON.stringify({
        action: "setData",
        endpoint: "settings",
        ...settings,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getExploreLatest = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "explore_latest",
        mode,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getExploreBest = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "explore_best",
        mode,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const upvote = (threadId: string) => {
    socketConnection?.send(
      JSON.stringify({
        action: "setData",
        endpoint: "upvote",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const downvote = (threadId: string) => {
    socketConnection?.send(
      JSON.stringify({
        action: "setData",
        endpoint: "downvote",
        threadId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getClickedVotes = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "clicked_votes",
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  return {
    sendMessage,
    initData,
    getThreadChatLog,
    getCharacter,
    getCharacters,
    deleteCharacter,
    getHeroActions,
    deleteHeroGame,
    deleteStory,
    getStory,
    setSettings,
    getSettings,
    getExploreBest,
    getExploreLatest,
    upvote,
    downvote,
    getClickedVotes,
    socketConnection,
  };
}
