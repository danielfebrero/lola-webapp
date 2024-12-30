import { useEffect } from "react";
import i18n from "i18next";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
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
} from "../store/features/app/appSlice";

export default function useWebSocket({
  setThreadId,
}: {
  setThreadId?: (threadId: string) => void;
}) {
  const auth = useAuth();
  const { socketConnection, currentlyViewing } = useAppSelector(
    (state) => state.app
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.onmessage = (event) => {
      console.log("Incoming message:", { data: event.data });
      try {
        const data = JSON.parse(event.data);
        console.log({ data });
        switch (data.action) {
          case "fetch":
            switch (data.type) {
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
                      })
                    );
                    console.log("Chat generation complete");
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
                    console.log("Chat generation done");
                    break;
                  case "partial":
                    // Handle logic for when chat generation is partial
                    console.log("Partial chat data received");

                    // Add assistant's message to the chat log
                    dispatch(
                      addChatLog({
                        threadId: data.threadId,
                        canSendMessage: false,
                        isInputAvailable: true,
                        content: data.content,
                        type: data.feature_type,
                        role: "assistant",
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
                      })
                    );
                    break;
                  default:
                    console.warn("Unhandled chat status:", data.status);
                }
                break;

              case "threads":
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
                    isImageProcessing: false,
                  })
                );
                break;

              case "messages":
                dispatch(
                  setChatLog({
                    chatLog: data.data,
                    threadId: data.threadId,
                    isInputAvailable: true,
                    isLoading: false,
                    type: data.feature_type,
                  })
                );
                break;

              case "hero_actions":
                console.log({ hero_actions: data.data });
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
              case "character":
                if (data.success) {
                  dispatch(deleteCharacterAction(data.threadId));
                  dispatch(deleteChatLog(data.threadId));

                  if (
                    currentlyViewing.objectType === "character" &&
                    currentlyViewing.objectId === data.threadId
                  )
                    navigate("/character/new");
                }
                break;

              case "you_are_the_hero":
                dispatch(deleteGame(data.threadId));
                dispatch(deleteChatLog(data.threadId));
                if (
                  currentlyViewing.objectType === "game" &&
                  currentlyViewing.objectId === data.threadId
                )
                  navigate("/game/new");
                break;

              default:
                console.warn("Unhandled delete type:", data.type);
            }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message", event.data, err);
      }
    };
  }, [socketConnection, dispatch, setThreadId]);

  const sendMessage = (
    message: string,
    endpoint: string,
    threadId: string | null,
    extraFields?: Record<string, any>
  ) => {
    track("sent_message");

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
      token: auth.user?.id_token,
      ...extraFields,
    };

    if (threadId) msg.threadId = threadId; // Include threadId if it exists

    socketConnection?.send(JSON.stringify(msg));
  };

  const initData = (websocket: WebSocket) => {
    console.log("Fetching initData");
    websocket.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "threads",
        token: auth.user?.id_token,
      })
    );
    websocket.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "characters",
        token: auth.user?.id_token,
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
        token: auth.user?.id_token,
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
        token: auth.user?.id_token,
      })
    );
  };

  const getCharacters = () => {
    console.log("Fetching Characters");
    socketConnection?.send(
      JSON.stringify({
        action: "fetchData",
        endpoint: "characters",
        token: auth.user?.id_token,
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
        token: auth.user?.id_token,
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
        token: auth.user?.id_token,
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
        token: auth.user?.id_token,
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
        token: auth.user?.id_token,
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
    socketConnection,
  };
}
