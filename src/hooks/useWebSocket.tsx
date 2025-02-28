import { useEffect } from "react";
import i18n from "i18next";
import { useAuth } from "react-oidc-context";
import { useNavigate, useSearchParams } from "react-router";
import { track } from "@vercel/analytics/react";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  addThread,
  setThreads,
  setThread,
  setThreadTitle,
  setCharacter,
  setCharacters,
  deleteThread,
  deleteCharacter as deleteCharacterAction,
  setGame,
  deleteGame,
  messageSentPlusOne,
  setStory,
  removeIsFromDataLoading,
  setIsCryptoCheckoutUrlLoading,
  setLastRequestWaitingForThreadId,
  addImageToMessage,
} from "../store/features/app/appSlice";
import {
  setClickedDownvotes,
  setClickedUpvotes,
  setSettings as setSettingsAction,
  setUserPlan,
} from "../store/features/user/userSlice";
import { setAdminAnalytics } from "../store/features/analytics/analyticsSlice";
import useGA from "./useGA";
import useNewChatLocation from "./useNewChatLocation";
import useCookie from "./useCookie";
import useAPI from "./useAPI";
import { setConnectionId } from "../store/features/socket/socketSlice";
import { v4 } from "uuid";

export default function useWebSocket({
  setThreadId,
}: {
  setThreadId?: (threadId: string) => void;
}) {
  const auth = useAuth();
  const newChatLocation = useNewChatLocation();
  const { currentlyViewing, mode, exploreLanguage, chatLogs, requestsStopped } =
    useAppSelector((state) => state.app);
  const { socketConnection } = useAppSelector((state) => state.socket);
  const api = useAPI();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sendEvent } = useGA();
  let [searchParams] = useSearchParams();
  const cookie = useCookie();

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.action) {
          case "plan":
            switch (data.type) {
              case "cancel_crypto_order":
                console.log({ data });
                break;
              case "get_crypto_checkout_url":
                dispatch(setIsCryptoCheckoutUrlLoading(false));
                window.location.href = data.data.checkout_url;
                break;
            }
            break;
          case "fetch":
            switch (data.type) {
              case "character_summary":
                dispatch(
                  setCharacter({ thread_id: data.threadId, ...data.data })
                );
                break;
              case "connection_id":
                dispatch(setConnectionId(data.data.connectionId));
                break;

              case "plan":
                dispatch(setUserPlan(data.data));
                break;
              case "analytics_admin":
                dispatch(setAdminAnalytics(data.data));
                break;
              case "clicked_votes":
                console.log("clicked votes", data.data);
                dispatch(setClickedUpvotes(data.data.upvotes));
                dispatch(setClickedDownvotes(data.data.downvotes));
                break;
              case "settings":
                dispatch(setSettingsAction(data.data));
                dispatch(removeIsFromDataLoading("settings"));
                break;
              case "story":
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
                if (
                  data.request_id &&
                  requestsStopped.includes(data.request_id)
                )
                  return;
                switch (data.status) {
                  case "complete":
                    // Handle logic for when chat generation is complete
                    if (data.threadId && data.feature_type === "character") {
                      dispatch(
                        setCharacter({
                          thread_id: data.threadId,
                          isReportProcessing: true,
                          // isImageProcessing: true,
                        })
                      );
                    }

                    if (
                      data.threadId &&
                      data.feature_type === "you_are_the_hero"
                    ) {
                      const chatLastRequset = chatLogs.find(
                        (log) => log.threadId === data.threadId
                      )?.lastRequestId;
                      if (data.request_id === !chatLastRequset) return;

                      dispatch(
                        setGame({
                          heroActionsIsLoading: true,
                          threadId: data.threadId,
                        })
                      );
                    }

                    dispatch(
                      setThread({
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
                          thread_id: data.threadId,
                          isReportProcessing: false,
                          isImageProcessing: false,
                        })
                      );
                    }
                    break;
                  case "partial":
                    // Add assistant's message to the chat log
                    if (
                      chatLogs.find((log) => log.threadId === data.threadId)
                        ?.isRequestStopped
                    )
                      return;
                    dispatch(
                      addThread({
                        threadId: data.threadId,
                        canSendMessage: false,
                        isInputAvailable: true,
                        content: data.content,
                        type: data.feature_type,
                        role: "assistant",
                        state: data.status,
                        ...data,
                      })
                    );
                    break;
                  case "init":
                    if (setThreadId) setThreadId(data.threadId);
                    dispatch(
                      setThread({
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
                dispatch(setThreads(data.data));
                dispatch(removeIsFromDataLoading("threads"));
                break;

              case "character":
                dispatch(
                  setCharacter({
                    thread_id: data.threadId,
                    isReportProcessing: false,
                    isImageProcessing: false,
                    ...data.data,
                  })
                );
                break;

              case "json_character_generation":
                dispatch(
                  setCharacter({
                    thread_id: data.threadId,
                    isReportProcessing: false,
                    isImageProcessing: !data.error,
                    ...data.data,
                  })
                );
                break;

              case "characters":
                dispatch(setCharacters(data.data));
                dispatch(removeIsFromDataLoading("characters"));
                break;

              case "thread_title":
                dispatch(
                  setThreadTitle({ threadId: data.threadId, title: data.title })
                );
                break;

              case "image_generation":
                if (data.featureType === "lola") {
                  dispatch(
                    addImageToMessage({
                      threadId: data.threadId,
                      request_id: data.request_id,
                      image: data.s3Urls,
                    })
                  );
                }
                if (data.featureType === "character") {
                  dispatch(
                    setCharacter({
                      thread_id: data.threadId,
                      newImage: data.s3Url,
                      newImagesMultisize: data.s3Urls,
                      isImageProcessing: false,
                    })
                  );
                }
                break;

              case "messages":
                if (data.errorCode === "403") navigate(newChatLocation);
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
                break;

              case "hero_actions":
                const chatLastRequset = chatLogs.find(
                  (log) => log.threadId === data.threadId
                )?.lastRequestId;
                if (data.request_id === !chatLastRequset) return;
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
                  dispatch(deleteThread(data.threadId));
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
                  dispatch(deleteThread(data.threadId));
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
                  dispatch(deleteThread(data.threadId));
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
    chatLogs,
  ]);

  const sendMessage = (
    message: string,
    endpoint: string,
    threadId: string | null,
    extraFields?: Record<string, any>
  ) => {
    const requestId = v4();

    track("sent_message");
    sendEvent("send_message_" + endpoint, endpoint);

    dispatch(messageSentPlusOne());

    // Add user's message to the chat log
    if (threadId) {
      dispatch(
        setThread({
          threadId,
          canSendMessage: false,
          lastRequestId: requestId,
          isRequestStopped: false,
        })
      );
      dispatch(
        addThread({
          threadId,
          content: message,
          role: "user",
          type: endpoint,
          is_private: extraFields?.isPrivate ?? false,
          lastRequsetId: requestId,
          request_id: requestId,
        })
      );
    } else {
      dispatch(setLastRequestWaitingForThreadId(requestId));
    }

    // Send the action via WebSocket
    const msg: Record<string, any> = {
      action: "generateText",
      endpoint: endpoint,
      input_text: message,
      language: i18n.language,
      mode,
      cookie,
      admin: searchParams.get("admin"),
      token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      requestId,
      ...extraFields,
    };

    if (threadId) msg.threadId = threadId; // Include threadId if it exists

    socketConnection?.send(JSON.stringify(msg));
  };

  const initData = () => {
    console.log("Fetching initData");
    api.getThreads();
    api.getCharacters();
    getSettings();
    getUserPlan();
  };

  const stopRequestId = (requestId: string) => {
    socketConnection?.send(
      JSON.stringify({
        action: "setData",
        endpoint: "stop_request_id",
        cookie,
        requestId,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getConnectionId = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "connection_id",
        cookie,
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
        cookie,
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
        cookie,
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
        cookie,
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
        cookie,
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
        cookie,
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
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getSettings = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "settings",
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const setSettings = (settings: Record<string, any>) => {
    socketConnection?.send(
      JSON.stringify({
        action: "setData",
        endpoint: "settings",
        cookie,
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
        cookie,
        language: exploreLanguage,
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
        cookie,
        language: exploreLanguage,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getExploreImages = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "explore_images",
        mode,
        cookie,
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
        cookie,
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
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getClickedVotes = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "clicked_votes",
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getAdminAnalytics = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "analytics_admin",
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getCryptoCheckoutUrl = (item: string) => {
    socketConnection?.send(
      JSON.stringify({
        action: "plan",
        endpoint: "get_crypto_checkout_url",
        item,
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const cancelCryptoOrder = (orderId: string) => {
    socketConnection?.send(
      JSON.stringify({
        action: "plan",
        endpoint: "cancel_crypto_order",
        orderId,
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  const getUserPlan = () => {
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "plan",
        cookie,
        token: auth?.isAuthenticated ? auth.user?.id_token : undefined,
      })
    );
  };

  return {
    sendMessage,
    initData,
    getCharacter,
    deleteCharacter,
    getHeroActions,
    deleteHeroGame,
    deleteStory,
    getStory,
    setSettings,
    getSettings,
    getExploreBest,
    getExploreLatest,
    getExploreImages,
    upvote,
    downvote,
    getClickedVotes,
    getAdminAnalytics,
    getCryptoCheckoutUrl,
    cancelCryptoOrder,
    getUserPlan,
    getConnectionId,
    stopRequestId,
    socketConnection,
  };
}
