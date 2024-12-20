import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

const LolaPage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isChatInputAvailable, setIsChatInputAvailable] =
    useState<boolean>(true);

  const { sendMessage, getThreadChatLog, socketConnection } = useWebSocket({
    setIsChatInputAvailable,
  });

  const chatLog = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.storyId)
        ?.chatLog ?? []
  );

  useEffect(() => {
    if (params.storyId) {
      console.log("get thread chat log");
      setThreadId(params.storyId);
      if (socketConnection?.readyState === WebSocket.OPEN) {
        getThreadChatLog(params.storyId);
      }
    }
  }, [params.storyId, socketConnection?.readyState]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({
        objectType: "story",
        objectId: params.storyId,
      })
    );
  }, [params.conversationId, dispatch]);

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

  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
        <div
          ref={chatContainerRef}
          className="grow overflow-y-scroll justify-center flex"
        >
          <Chat type="story" id={params.conversationId} chatLog={chatLog} />
        </div>
        <div className="justify-center flex w-full">
          <div className="w-[65%]">
            <SendChatInput
              type="story"
              onSend={(message) => sendMessage(message, "story", threadId)}
              isChatInputAvailable={isChatInputAvailable}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LolaPage;
