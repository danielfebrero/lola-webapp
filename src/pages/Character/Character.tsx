import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useParams, useNavigate } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import ExploreIcon from "../../icons/explore";
import ChatIcon from "../../icons/chat";

interface CharacterPageProps {
  selected?: Record<string, string>;
}

const newroleChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    role: "assistant",
    type: "character",
  },
];

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const chatLogState = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.characterId)
        ?.chatLog ?? newroleChat
  );
  const { chatLogs, isSmallScreen } = useAppSelector((state) => state.app);
  const character = useAppSelector(
    (state) =>
      state.app.characters.find(
        (char) => char.threadId === params.characterId
      ) ?? ({} as Character)
  );
  const [threadId, setThreadId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>(chatLogState);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isImageGenerating, setIsImageGenerating] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isChatInputAvailable, setIsChatInputAvailable] =
    useState<boolean>(true);
  const [mobileView, setMobileView] = useState<string>("chat");

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "images"
  >("report");

  const { sendMessage, getThreadChatLog, getCharacter, socketConnection } =
    useWebSocket({
      setThreadId,
      setIsChatInputAvailable,
      setIsProcessing,
      setIsChatLoading,
      setIsImageGenerating,
    });

  const sendMessageToCharacter = (content: string, threadId: string | null) => {
    console.log({ content, threadId });
    sendMessage(content, "character", threadId);
    if (chatLog.length === 1)
      setChatLog((prev) => [...prev, { role: "user", content }]);
  };

  const handleViewTypeChange = (viewType: "report" | "json" | "images") => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    if (params.characterId && params.characterId !== "new") {
      setIsChatLoading(true);
      setIsProcessing(true);
      if (params.characterId !== threadId) setThreadId(params.characterId);
      setTimeout(() => {
        if (
          socketConnection?.readyState === WebSocket.OPEN &&
          params.characterId
        ) {
          console.log("get thread chat log");
          getThreadChatLog(params.characterId);
          console.log("get character");
          getCharacter(params.characterId);
        }
      }, 50);
    }
  }, [params.characterId, socketConnection?.readyState, threadId]);

  useEffect(() => {
    if (threadId && threadId !== "new") {
      navigate("/character/" + threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (chatLogState) setChatLog(chatLogState);
  }, [chatLogState]);

  useEffect(() => {
    if (params.characterId === "new") {
      setThreadId(null);
      setChatLog(newroleChat);
    }
  }, [params.characterId]);

  useEffect(() => {
    const mainId =
      chatLogs.filter((log) => log.type === "character")[0]?.threadId ?? null;
    if (props.selected?.type === "main") setThreadId(mainId);
  }, [props.selected, chatLogs]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "character", objectId: threadId })
    );
  }, [dispatch, threadId]);

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
    <div className="grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll">
      {isSmallScreen && (
        <div className="fixed flex flex-col w-full text-textSecondary left-[15px]">
          <div
            className="h-[24px] w-[24px]"
            onClick={() => setMobileView("chat")}
          >
            <ChatIcon />
          </div>
          <div
            className="h-[24px] w-[24px]  mt-[10px]"
            onClick={() => setMobileView("report")}
          >
            <ExploreIcon />
          </div>
        </div>
      )}
      {(!isSmallScreen || mobileView === "chat") && (
        <div className="grow md:border-r-2 md:border-borderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll">
          <div className="grow overflow-y-scroll" ref={chatContainerRef}>
            <Chat
              type="character"
              id={threadId}
              chatLog={chatLog}
              isChatLoading={isChatLoading}
            />
          </div>
          <div className="justify-center flex w-full md:px-0 px-[30px]">
            <SendChatInput
              type="character"
              id={threadId}
              isChatInputAvailable={isChatInputAvailable}
              onSend={(message) => sendMessageToCharacter(message, threadId)}
            />
          </div>
        </div>
      )}

      {(!isSmallScreen || mobileView === "report") && (
        <div className="grow md:w-1/2 pl-5 flex items-center flex-col h-[calc(100vh-110px)]">
          <div className="bg-lightGray p-[5px] rounded-lg w-fit flex flex-row">
            {["report", "JSON", "images"].map((viewType) => (
              <div key={viewType}>
                <div
                  onClick={() =>
                    handleViewTypeChange(
                      viewType.toLowerCase() as "report" | "json" | "images"
                    )
                  }
                  className={clsx(
                    "cursor-pointer",
                    "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                    "rounded-lg",
                    {
                      "text-textPrimary border border-borderLight bg-white":
                        selectedRightViewType === viewType.toLowerCase(),
                      "text-gray-400":
                        selectedRightViewType !== viewType.toLowerCase(),
                    }
                  )}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 w-full   overflow-y-scroll">
            {selectedRightViewType === "report" && (
              <div className="w-full">
                <ReportView
                  type="character"
                  id={threadId}
                  json={character.json}
                  images={character.images}
                  isProcessing={isProcessing}
                  isImageGenerating={isImageGenerating}
                />
              </div>
            )}
            {selectedRightViewType === "json" && (
              <div className="w-full">
                <JSONView
                  type="character"
                  id={threadId}
                  json={character.json}
                  isProcessing={isProcessing}
                />
              </div>
            )}
            {selectedRightViewType === "images" && (
              <div className="w-full">
                <ImageView
                  type="character"
                  id={threadId}
                  images={character.images}
                  isProcessing={isImageGenerating}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterPage;
