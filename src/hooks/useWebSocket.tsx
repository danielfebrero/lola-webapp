import { useEffect } from "react";
import i18n from "i18next";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  addChatLog,
  setChatLogs,
  setChatLog,
  setThreadTitle,
  setCharacter,
  setCharacters,
} from "../store/features/app/appSlice";

export default function useWebSocket({
  setThreadId,
  setIsChatInputAvailable,
  setIsProcessing,
  setIsChatLoading,
  setIsImageGenerating,
}: {
  setThreadId?: (threadId: string) => void;
  setIsChatInputAvailable?: (isChatInputAvailable: boolean) => void;
  setIsProcessing?: (isProcessing: boolean) => void;
  setIsChatLoading?: (isChatLoading: boolean) => void;
  setIsImageGenerating?: (isImageGenerating: boolean) => void;
}) {
  const socketConnection = useAppSelector(
    (state) => state.app.socketConnection
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.onmessage = (event) => {
      console.log("Incoming message:", { data: event.data });
      try {
        const data = JSON.parse(event.data);
        console.log({ data });
        switch (data.type) {
          case "chat":
            switch (data.status) {
              case "complete":
                // Handle logic for when chat generation is complete
                if (setIsChatInputAvailable) setIsChatInputAvailable(true);
                if (setIsProcessing) setIsProcessing(true);
                if (setIsImageGenerating) setIsImageGenerating(true);
                console.log("Chat generation complete");
                break;
              case "done":
                // Handle logic for when chat generation is done
                if (setIsProcessing) setIsProcessing(false);
                if (setIsImageGenerating) setIsImageGenerating(false);
                console.log("Chat generation done");
                break;
              case "partial":
                // Handle logic for when chat generation is partial
                console.log("Partial chat data received");

                // Add assistant's message to the chat log
                dispatch(
                  addChatLog({
                    threadId: data.threadId,
                    content: data.content,
                    type: data.feature_type,
                    role: "assistant",
                  })
                );
                break;
              case "init":
                if (setThreadId) setThreadId(data.threadId);
                if (setIsChatInputAvailable) setIsChatInputAvailable(false);
                break;
              default:
                console.warn("Unhandled chat status:", data.status);
            }
            break;

          case "threads":
            dispatch(setChatLogs(data.data));
            break;

          case "character":
            if (setIsProcessing) setIsProcessing(false);
            dispatch(setCharacter({ threadId: data.threadId, ...data.data }));
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
            if (setIsImageGenerating) setIsImageGenerating(false);
            dispatch(
              setCharacter({ threadId: data.threadId, newImage: data.s3Url })
            );

            break;

          case "messages":
            if (setIsChatLoading) setIsChatLoading(false);
            if (setIsChatInputAvailable) setIsChatInputAvailable(true);
            dispatch(
              setChatLog({
                chatLog: data.data,
                threadId: data.threadId,
                type: data.feature_type,
              })
            );
            break;

          case "error":
            console.error("Error from server:", data.error);
            break;

          default:
            console.warn("Unhandled message type:", data.type);
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
    // Add user's message to the chat log
    if (setIsChatInputAvailable) setIsChatInputAvailable(false);

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
      ...extraFields,
    };

    if (threadId) msg.threadId = threadId; // Include threadId if it exists

    socketConnection?.send(JSON.stringify(msg));
  };

  const initData = (websocket: WebSocket) => {
    console.log("Fetching initData");
    websocket.send(
      JSON.stringify({ action: "fetchData", endpoint: "threads" })
    );
    websocket.send(
      JSON.stringify({ action: "fetchData", endpoint: "characters" })
    );
  };

  const getThreadChatLog = (threadId: string) => {
    console.log("Fetching chatLog for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({ action: "fetchData", endpoint: "messages", threadId })
    );
  };

  const getCharacter = (threadId: string) => {
    console.log("Fetching Character for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({ action: "fetchData", endpoint: "character", threadId })
    );
  };

  const getCharacters = () => {
    console.log("Fetching Characters");
    socketConnection?.send(
      JSON.stringify({ action: "fetchData", endpoint: "characters" })
    );
  };

  return {
    sendMessage,
    initData,
    getThreadChatLog,
    getCharacter,
    getCharacters,
    socketConnection,
  };
}
