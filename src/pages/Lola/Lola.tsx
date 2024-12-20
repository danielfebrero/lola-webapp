import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import { addChatLog } from "../../store/features/app/appSlice";

const LolaPage: React.FC = () => {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { sendMessage } = useWebSocket({ setThreadId });

  const chatLogs = useAppSelector((state) => state.app.chatLogs);

  const sendMessageToLola = (
    content: string,
    type: string,
    threadId: string | null
  ) => {
    sendMessage(content, type, threadId);
    if (chatLog.length === 0) setChatLog([{ role: "user", content }]);
  };

  useEffect(() => {
    const log =
      chatLogs.find((log) => log.threadId === params.conversationId)?.chatLog ??
      chatLog;
    setChatLog(log);
  }, [chatLogs]);

  useEffect(() => {
    if (threadId) {
      if (chatLog.length === 1)
        dispatch(
          addChatLog({ threadId, content: chatLog[0].content, role: "user" })
        );
      navigate("/lola/" + threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (!params.conversationId) {
      setThreadId(null);
      setChatLog([]);
    }
  }, [params.conversationId]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({
        objectType: "lola",
        objectId: params.conversationId,
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
          <Chat type="lola" id={params.conversationId} chatLog={chatLog} />
        </div>
        <div className="justify-center flex w-full">
          <div className="w-[65%]">
            <SendChatInput
              type="lola"
              onSend={(message) => sendMessageToLola(message, "lola", threadId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LolaPage;
