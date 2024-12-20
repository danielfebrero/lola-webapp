import { useState, useEffect } from "react";
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
import { addChatLog } from "../../store/features/app/appSlice";

interface CharacterPageProps {
  selected?: Record<string, string>;
}

const newroleChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    role: "dani",
    type: "character",
  },
];

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const chatLogState = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.characterId)
        ?.chatLog ?? []
  );
  const [threadId, setThreadId] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string | undefined>(
    params.characterId
  );
  const [chatLog, setChatLog] = useState<Message[]>(chatLogState);

  const dispatch = useAppDispatch();
  const [isChatInputAvailable, setIsChatInputAvailable] =
    useState<boolean>(true);

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "image"
  >("report");

  const { sendMessage, getThreadChatLog, socketConnection } = useWebSocket({
    setThreadId,
    setIsChatInputAvailable,
  });

  const sendMessageToCharacter = (content: string, threadId: string | null) => {
    sendMessage(content, "character", threadId);
    if (chatLog.length === 1)
      setChatLog((prev) => [...prev, { role: "user", content }]);
  };

  const handleViewTypeChange = (viewType: "report" | "json" | "image") => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    if (params.characterId && params.characterId !== "new") {
      console.log("get thread chat log");
      setThreadId(params.characterId);
      if (socketConnection?.readyState === WebSocket.OPEN) {
        if (chatLogState.length === 0) {
          dispatch(
            addChatLog({
              threadId: params.characterId,
              content: newroleChat[0].content,
              role: "assistant",
              type: "character",
              timestamp: 0,
            })
          );
        }
        getThreadChatLog(params.characterId);
      }
    }
  }, [params.characterId, socketConnection?.readyState]);

  useEffect(() => {
    if (threadId && threadId !== "new") {
      navigate("/character/" + threadId);
      setChatLog([]);
    }
  }, [threadId]);

  useEffect(() => {
    const log = chatLogState ?? chatLog;
    setChatLog(log);
  }, [chatLogState]);

  useEffect(() => {
    if (params.characterId === "new") {
      setThreadId(null);
      setChatLog(newroleChat);
    }
  }, [params.characterId]);

  useEffect(() => {
    const mainId = "mainId";
    if (props.selected?.type === "main") setCharacterId(mainId);
  }, [props.selected]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "character", objectId: characterId })
    );
  }, [characterId]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-borderColor w-1/2 pr-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="grow overflow-y-scroll">
          <Chat type="character" id={characterId} chatLog={chatLog} />
        </div>
        <SendChatInput
          type="character"
          id={characterId}
          isChatInputAvailable={isChatInputAvailable}
          onSend={(message) => sendMessageToCharacter(message, threadId)}
        />
      </div>

      <div className="grow w-1/2 pl-5 flex items-center flex-col">
        <div className="bg-lightGray p-[5px] rounded-lg w-fit flex flex-row">
          {["report", "JSON", "image"].map((viewType) => (
            <>
              <div
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
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
            </>
          ))}
        </div>
        <div className="mt-4">
          {selectedRightViewType === "report" && (
            <div>
              <ReportView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "json" && (
            <div>
              <JSONView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "image" && (
            <div>
              <ImageView type="character" id={characterId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
