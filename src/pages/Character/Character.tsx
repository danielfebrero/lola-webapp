import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setCharacter,
  setChatLog as setChatLogAction,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import useGA from "../../hooks/useGA";
import Meta from "../../components/Meta";

interface CharacterPageProps {
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { sendEvent } = useGA();

  const newroleChat = useCallback(
    () => [
      {
        content: t(
          "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?"
        ),
        role: "assistant",
        type: "character",
      },
    ],
    [t]
  );

  const chatLogState = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.characterId)
        ?.chatLog ?? newroleChat
  );
  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.characterId)
  );
  const { isSmallScreen } = useAppSelector((state) => state.app);
  const character = useAppSelector(
    (state) =>
      state.app.characters.find(
        (char) => char.threadId === params.characterId
      ) ?? ({} as Character)
  );
  const [threadId, setThreadId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const dispatch = useAppDispatch();
  useState<boolean>(true);

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "images" | "chat"
  >(isSmallScreen ? "chat" : "report");

  const { sendMessage, getThreadChatLog, getCharacter, socketConnection } =
    useWebSocket({
      setThreadId,
    });

  const sendMessageToCharacter = (content: string, threadId: string | null) => {
    console.log({ content, threadId });
    sendMessage(content, "character", threadId);
    if (chatLog.length === 1)
      setChatLog((prev) => [...prev, { role: "user", content }]);
  };

  const handleViewTypeChange = (
    viewType: "report" | "json" | "images" | "chat"
  ) => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    if (
      params.characterId &&
      params.characterId !== "new" &&
      threadId !== params.characterId
    ) {
      dispatch(
        setChatLogAction({
          threaId: params.characterId,
          isLoading: true,
          isInputAvailable: false,
        })
      );
      dispatch(
        setCharacter({
          threadId: params.characterId,
          isImageProcessing: true,
          isReportProcessing: true,
        })
      );
      if (socketConnection?.readyState === WebSocket.OPEN) {
        setThreadId(params.characterId);
        setTimeout(() => {
          if (params.characterId) {
            getThreadChatLog(params.characterId);
            getCharacter(params.characterId);
          }
        }, 50);
      }
    }
  }, [
    dispatch,
    getCharacter,
    getThreadChatLog,
    params.characterId,
    socketConnection?.readyState,
    threadId,
  ]);

  useEffect(() => {
    if (
      params.characterId &&
      params.characterId !== "new" &&
      params.characterId !== "main" &&
      socketConnection?.readyState === WebSocket.OPEN
    ) {
      getThreadChatLog(params.characterId);
      getCharacter(params.characterId);
    }
  }, [socketConnection?.readyState]);

  useEffect(() => {
    if (threadId) {
      navigate("/character/" + threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (
      chatLogState &&
      params.characterId !== "new" &&
      params.characterId !== "main"
    )
      setChatLog(chatLogState);
  }, [chatLogState, params.characterId]);

  useEffect(() => {
    if (params.characterId === "new") {
      setThreadId(null);
      setChatLog(newroleChat);
    }
  }, [newroleChat, params.characterId]);

  useEffect(() => {
    setThreadId(
      params.characterId !== "new" ? params.characterId ?? null : null
    );

    return () => {
      setThreadId(null);
    };
  }, []);

  // useEffect(() => {
  //   // const mainId =
  //   //   chatLogs.filter((log) => log.type === "character")[0]?.threadId ?? null;
  //   // if (props.selected?.type === "main" && mainId && threadId !== mainId) {
  //   //   navigate("/character/" + mainId);
  //   // }

  //   if (props.selected?.type === "main") {
  //     navigate("/character/new");
  //   }
  // }, [props.selected, chatLogs]);

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
    <>
      <Meta title={character.json?.name ?? t("Character")} />
      <div className="grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll no-scrollbar">
        {/* {isSmallScreen && !isLeftPanelOpen && (
          <div className="fixed grid grid-cols-2 items-center text-textSecondary dark:text-darkTextSecondary w-full justify-center">
            <div
              className="h-[24px] w-[24px]"
              onClick={() => setMobileView("chat")}
            >
              <ChatIcon />
            </div>
            <div
              className="h-[24px] w-[24px] "
              onClick={() => setMobileView("report")}
            >
              <ExploreIcon />
            </div>
          </div>
        )} */}
        {!isSmallScreen && (
          <div className="grow md:border-r-2 md:border-borderColor dark:md:border-darkBorderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll no-scrollbar">
            <div
              className="grow overflow-y-scroll no-scrollbar justify-center flex"
              ref={chatContainerRef}
            >
              <Chat
                type="character"
                id={threadId}
                chatLog={chatLog}
                isChatLoading={chatState?.isLoading ?? false}
              />
            </div>
            <div className="justify-center flex w-full md:px-0 px-[30px]">
              <SendChatInput
                type="character"
                id={threadId}
                isChatInputAvailable={chatState?.isInputAvailable ?? true}
                canSendMessage={chatState?.canSendMessage ?? true}
                onSend={(message) => sendMessageToCharacter(message, threadId)}
              />
            </div>
          </div>
        )}

        {
          <div className="grow md:w-1/2 md:pl-5 flex items-center flex-col h-[calc(100vh-110px)]">
            <div className="bg-lightGray dark:bg-darkLightGray p-[5px] rounded-lg w-fit flex flex-row">
              {(isSmallScreen
                ? ["chat", "report", "images"]
                : ["report", "images"]
              ).map((viewType) => (
                <div
                  key={viewType}
                  onClick={() => {
                    sendEvent("click_char_" + viewType);
                    handleViewTypeChange(
                      viewType.toLowerCase() as "report" | "json" | "images"
                    );
                  }}
                  className={clsx(
                    "cursor-pointer",
                    "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                    "rounded-lg",
                    {
                      "text-textPrimary dark:text-darkTextPrimary border border-borderLight bg-white dark:bg-darkMessageBackground":
                        selectedRightViewType === viewType.toLowerCase(),
                      "text-gray-400":
                        selectedRightViewType !== viewType.toLowerCase(),
                    }
                  )}
                >
                  {t(viewType.charAt(0).toUpperCase() + viewType.slice(1))}
                </div>
              ))}
            </div>
            <div className="mt-4 w-full grow overflow-y-scroll no-scrollbar">
              {selectedRightViewType === "chat" && (
                <div className="flex h-full flex-col">
                  <div
                    className="grow overflow-y-scroll no-scrollbar"
                    ref={chatContainerRef}
                  >
                    <Chat
                      type="character"
                      id={threadId}
                      chatLog={chatLog}
                      isChatLoading={chatState?.isLoading ?? false}
                    />
                  </div>
                  <div className="justify-center flex w-full md:px-0 px-[30px]">
                    <SendChatInput
                      type="character"
                      id={threadId}
                      isChatInputAvailable={chatState?.isInputAvailable ?? true}
                      canSendMessage={chatState?.canSendMessage ?? true}
                      onSend={(message) =>
                        sendMessageToCharacter(message, threadId)
                      }
                    />
                  </div>
                </div>
              )}
              {selectedRightViewType === "report" && (
                <div className="w-full">
                  <ReportView
                    type="character"
                    id={threadId}
                    json={character.json}
                    images={character.images}
                    imagesMultisize={character.imagesMultisize}
                    isProcessing={character.isReportProcessing ?? false}
                    isImageGenerating={character.isImageProcessing ?? false}
                  />
                </div>
              )}
              {selectedRightViewType === "json" && (
                <div className="w-full">
                  <JSONView
                    type="character"
                    id={threadId}
                    json={character.json}
                    isProcessing={character.isReportProcessing ?? false}
                  />
                </div>
              )}
              {selectedRightViewType === "images" && (
                <div className="w-full">
                  <ImageView
                    type="character"
                    id={threadId}
                    images={character.images}
                    imagesMultisize={character.imagesMultisize}
                    isImageGenerating={character.isImageProcessing ?? false}
                  />
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default CharacterPage;
