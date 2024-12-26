import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setChatLog,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

const Storypage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const { sendMessage, getThreadChatLog, socketConnection } = useWebSocket({});

  const chatLog = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.storyId)
        ?.chatLog ?? []
  );

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.storyId)
  );

  useEffect(() => {
    if (params.storyId) {
      setThreadId(params.storyId);
      dispatch(
        setChatLog({
          threadId: params.storyId,
          isInputAvailable: false,
          isLoading: true,
        })
      );
      if (socketConnection?.readyState === WebSocket.OPEN) {
        console.log("get thread chat log");
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
    }, 0);
    return () => clearTimeout(timer);
  }, [chatLog]);

  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] md:pb-[20px] pb-[10px] flex flex-col h-[calc(100vh-75px)]">
        <div
          ref={chatContainerRef}
          className="grow overflow-y-scroll no-scrollbar justify-center flex"
        >
          <Chat
            type="story"
            id={params.conversationId}
            chatLog={chatLog}
            isChatLoading={chatState?.isLoading ?? false}
          />
        </div>
        <div className="justify-center flex w-full">
          <div className="md:max-w-[715px] w-[100%] px-[30px]">
            <SendChatInput
              type="story"
              onSend={(message) => sendMessage(message, "story", threadId)}
              canSendMessage={chatState?.canSendMessage ?? true}
              isChatInputAvailable={chatState?.isInputAvailable ?? true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storypage;
