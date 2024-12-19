import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

const WEBSOCKET_URL =
  "wss://2yncx4m7ji.execute-api.us-east-1.amazonaws.com/dev";

const StoryPage: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "story", objectId: params.storyId })
    );
  }, [params.storyId, dispatch]);

  useEffect(() => {
    // Open the WebSocket connection
    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      console.log("Incoming message:", event.data);
      try {
        const data = JSON.parse(event.data);

        // Check if a threadId is returned by the server
        if (data.threadId) {
          setThreadId(data.threadId);
          // This message might just be threadId info, so we can return if no content
          return;
        }

        if (data.status === "done") {
          // Generation ended
          // Could handle any cleanup or finalization
        } else if (data.error) {
          // Handle error
          console.error("Error from server:", data.error);
        } else if (typeof data === "string") {
          // data is a piece of text from the assistant
          setChatLog((oldLog) => {
            // If last message is from assistant, append to it
            if (
              oldLog.length > 0 &&
              oldLog[oldLog.length - 1].character === "narrator"
            ) {
              const updatedMsg = {
                ...oldLog[oldLog.length - 1],
                content: oldLog[oldLog.length - 1].content + data,
              };
              return [...oldLog.slice(0, -1), updatedMsg];
            } else {
              // Start a new assistant message
              return [...oldLog, { character: "narrator", content: data }];
            }
          });
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message", event.data, err);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      // Cleanup: close WebSocket on unmount
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [chatLog]);

  // Function to handle user input from SendChatInput
  const handleUserMessage = (message: string) => {
    // Add user message to chat
    setChatLog((oldLog) => [
      ...oldLog,
      { character: "user", content: message },
    ]);

    // Send action via WebSocket
    const msg: Record<string, any> = {
      action: "generateText", // Updated action name
      endpoint: "story",
      input_text: message,
    };

    if (threadId) {
      msg.threadId = threadId; // Include threadId if available
    }

    wsRef.current?.send(JSON.stringify(msg));
  };

  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
        <div
          ref={chatContainerRef}
          className="grow overflow-y-scroll justify-center flex"
        >
          <Chat type="story" id={params.storyId} chatLog={chatLog} />
        </div>
        <div className="justify-center flex w-full">
          <div className="w-[65%]">
            <SendChatInput type="story" onSend={handleUserMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
