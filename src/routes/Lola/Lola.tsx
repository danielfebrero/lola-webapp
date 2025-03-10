import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setThread as setThreadAction,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";
import useAutoScroll from "../../hooks/useAutoScroll";
import { Message } from "../../types/chat";
import { reduceOneImageClassicPlus } from "../../store/features/user/userSlice";

const LolaPage: React.FC = () => {
  const { plan, quotas } = useAppSelector((state) => state.user);
  const [chatLog, setThread] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { getMessages } = useAPI();
  const [isAssistantWriting, setIsAssistantWriting] = useState<boolean>(false);
  const { t } = useTranslation();
  const { autoScroll } = useAutoScroll(chatContainerRef);
  const [genImage, setGenImage] = useState<boolean>(false);
  const [genImageModel, setGenImageModel] = useState<string>(
    plan !== "free" || quotas?.images_classic_plus > 0 ? "classic+" : "classic"
  );
  const [uncensored, setUncensored] = useState<boolean>(plan !== "free");
  const { lastRequestIdWaitingForThreadId } = useAppSelector(
    (state) => state.app
  );

  const lolaSetThreadId = useCallback(
    (threadId: string | null) => {
      setThreadId(threadId);
      dispatch(
        setThreadAction({
          threadId,
          lastRequestId: lastRequestIdWaitingForThreadId,
        })
      );
    },
    [dispatch, lastRequestIdWaitingForThreadId]
  );

  const { sendMessage, socketConnection } = useWebSocket({
    setThreadId: lolaSetThreadId,
  });

  const chatLogs = useAppSelector((state) => state.app.chatLogs);

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.threadId)
  );

  const sendMessageToLola = (
    content: string,
    threadId: string | null,
    turnOnImageGeneration: boolean,
    isUncensored: boolean,
    imageModelType: string
  ) => {
    sendMessage(content, "lola", threadId, {
      turnOnImageGeneration,
      isUncensored,
      imageModelType,
    });
    if (chatLog.length === 0) setThread([{ role: "user", content }]);
    if (imageModelType === "classic+") dispatch(reduceOneImageClassicPlus());
  };

  useEffect(() => {
    setIsAssistantWriting(
      chatState?.isOwner ? !(chatState?.canSendMessage ?? true) : false
    );
  }, [chatState]);

  useEffect(() => {
    if (params.threadId && params.threadId !== "new") {
      dispatch(
        setThreadAction({
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
    setThread(log);
  }, [chatLogs]);

  useEffect(() => {
    if (threadId) {
      navigate("/lola/" + threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (params.threadId === "new") {
      setThreadId(null);
      setThread([]);
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
    if (!autoScroll) return;
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [chatLog, autoScroll]);

  return (
    <>
      <Meta title={"Lola chatbot"} />
      <div className="flex justify-center h-full">
        <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
          {params.threadId !== "new" ? (
            <>
              <div
                ref={chatContainerRef}
                className="grow overflow-y-scroll no-scrollbar justify-center flex px-5"
              >
                <Chat
                  type="lola"
                  id={threadId}
                  chatLog={chatLog}
                  isChatLoading={chatState?.isLoading ?? false}
                  isAssistantWriting={isAssistantWriting}
                />
              </div>
              <div className="justify-center flex w-full">
                <div className="md:max-w-[715px] w-[100%] px-[20px]">
                  <SendChatInput
                    type="lola"
                    threadId={threadId}
                    onSend={(message) =>
                      sendMessageToLola(
                        message,
                        threadId,
                        genImage,
                        uncensored,
                        genImageModel
                      )
                    }
                    canSendMessage={chatState?.canSendMessage ?? true}
                    isChatInputAvailable={chatState?.isInputAvailable ?? true}
                    showGenImage={true}
                    setGenImage={setGenImage}
                    genImage={genImage}
                    genImageModel={genImageModel}
                    setGenImageModel={setGenImageModel}
                    showUncensored={plan !== "free"}
                    uncensored={uncensored}
                    setUncensored={setUncensored}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grow flex flex-col justify-center items-center text-center">
              <span className="text-4xl">{t("How can I help you?")}</span>
              <div className="justify-center flex w-full">
                <div className="md:max-w-[715px] w-[100%] px-[20px] mt-[20px]">
                  <SendChatInput
                    type="lola"
                    threadId={threadId}
                    onSend={(message) =>
                      sendMessageToLola(
                        message,
                        threadId,
                        genImage,
                        uncensored,
                        genImageModel
                      )
                    }
                    canSendMessage={true}
                    isChatInputAvailable={true}
                    showGenImage={true}
                    setGenImage={setGenImage}
                    genImage={genImage}
                    genImageModel={genImageModel}
                    setGenImageModel={setGenImageModel}
                    showUncensored={plan !== "free"}
                    uncensored={uncensored}
                    setUncensored={setUncensored}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LolaPage;
