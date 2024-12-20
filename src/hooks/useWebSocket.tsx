import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addChatLog } from "../store/features/app/appSlice";

export default function useWebSocket({
  setThreadId,
}: {
  setThreadId?: (threadId: string) => void;
}) {
  const socketConnection = useAppSelector(
    (state) => state.app.socketConnection
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.onopen = () => {
      console.log("WebSocket connected");
    };

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
                    role: "assistant",
                  })
                );
                break;
              case "init":
                if (setThreadId) setThreadId(data.threadId);
                break;
              default:
                console.warn("Unhandled chat status:", data.status);
            }
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

    socketConnection.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }, [socketConnection, dispatch, setThreadId]);

  const sendMessage = (
    message: string,
    endpoint: string,
    threadId: string | null
  ) => {
    // Add user's message to the chat log
    if (threadId)
      dispatch(
        addChatLog({
          threadId,
          content: message,
          role: "user",
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

  return { sendMessage };
}
