import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  addChatLog,
  setChatLogs,
  setChatLog,
  setThreadTitle,
} from "../store/features/app/appSlice";

export default function useWebSocket({
  setThreadId,
  setIsChatInputAvailable,
}: {
  setThreadId?: (threadId: string) => void;
  setIsChatInputAvailable?: (isChatInputAvailable: boolean) => void;
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
                console.log("Chat generation complete");
                break;
              case "done":
                // Handle logic for when chat generation is done
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
                    type: data.type,
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

          case "thread_title":
            dispatch(
              setThreadTitle({ threadId: data.threadId, title: data.title })
            );
            break;

          case "messages":
            dispatch(
              setChatLog({
                chatLog: data.data,
                threadId: data.threadId,
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
    threadId: string | null
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
    };

    if (threadId) msg.threadId = threadId; // Include threadId if it exists

    socketConnection?.send(JSON.stringify(msg));
  };

  const initData = (websocket: WebSocket) => {
    console.log("Sending initData");
    websocket.send(
      JSON.stringify({ action: "fetchData", endpoint: "threads" })
    );
  };

  const getThreadChatLog = (threadId: string) => {
    console.log("Fetching chatLog for thread: ", threadId);
    socketConnection?.send(
      JSON.stringify({ action: "fetchData", endpoint: "messages", threadId })
    );
  };
  return { sendMessage, initData, getThreadChatLog, socketConnection };
}
