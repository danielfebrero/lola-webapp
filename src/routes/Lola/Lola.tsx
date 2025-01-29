import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setChatLog as setChatLogAction,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import { addChatLog } from "../../store/features/app/appSlice";
import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";

const LolaPage: React.FC = () => {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { getMessages } = useAPI();
  const [isAssistantWriting, setIsAssistantWriting] = useState<boolean>(false);

  const { sendMessage, socketConnection } = useWebSocket({
    setThreadId,
  });

  const chatLogs = useAppSelector((state) => state.app.chatLogs);

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.threadId)
  );

  const sendMessageToLola = (content: string, threadId: string | null) => {
    sendMessage(content, "lola", threadId);
    if (chatLog.length === 0) setChatLog([{ role: "user", content }]);
  };

  useEffect(() => {
    setIsAssistantWriting(
      chatState?.isOwner ? !(chatState?.canSendMessage ?? true) : false
    );
  }, [chatState]);

  useEffect(() => {
    if (params.threadId) {
      console.log("get thread chat log");
      dispatch(
        setChatLogAction({
          threadId: params.threadId,
          isLoading: true,
          isInputAvailable: false,
        })
      );
      setThreadId(params.threadId);
      if (socketConnection?.readyState === WebSocket.OPEN) {
        getMessages(params.threadId);
      }
    }
  }, [params.threadId, socketConnection?.readyState]);

  useEffect(() => {
    const log =
      chatLogs.find((log) => log.threadId === params.threadId)?.chatLog ??
      chatLog;
    setChatLog(log);
  }, [chatLogs]);

  useEffect(() => {
    if (threadId) {
      if (chatLog.length === 1)
        dispatch(
          addChatLog({
            threadId,
            content: chatLog[0].content,
            role: "user",
            type: "lola",
          })
        );
      navigate("/lola/" + threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (!params.threadId) {
      setThreadId(null);
      setChatLog([]);
    }
  }, [params.threadId]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({
        objectType: "lola",
        objectId: params.threadId,
      })
    );
  }, [params.threadId, dispatch]);

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
    <>
      <Meta title={"Lola"} />
      <div className="flex justify-center h-full">
        <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
          <div
            ref={chatContainerRef}
            className="grow overflow-y-scroll no-scrollbar justify-center flex"
          >
            <Chat
              type="lola"
              id={params.threadId}
              chatLog={chatLog}
              isChatLoading={chatState?.isLoading ?? false}
              isAssistantWriting={isAssistantWriting}
            />
          </div>
          <div className="justify-center flex w-full">
            <div className="w-[65%]">
              <SendChatInput
                type="lola"
                onSend={(message) => sendMessageToLola(message, threadId)}
                canSendMessage={chatState?.canSendMessage ?? true}
                isChatInputAvailable={chatState?.isInputAvailable ?? true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LolaPage;
