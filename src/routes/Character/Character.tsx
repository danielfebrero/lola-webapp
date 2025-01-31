import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { useParams, useNavigate, useLocation, NavLink } from "react-router";
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
import useAPI from "../../hooks/useAPI";

interface CharacterPageProps {
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { sendEvent } = useGA();
  const { plan } = useAppSelector((state) => state.user);
  const [newIsPrivate, setNewIsPrivate] = useState<boolean>(
    plan !== "free" && params.threadId === "new"
  );

  const { getMessages } = useAPI();

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
      state.app.chatLogs.find((log) => log.threadId === params.threadId)
        ?.chatLog ?? newroleChat
  );
  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.threadId)
  );
  const { isSmallScreen, lastRequestIdWaitingForThreadId, isDataLoading } =
    useAppSelector((state) => state.app);
  const character = useAppSelector(
    (state) =>
      state.app.characters.find((char) => char.thread_id === params.threadId) ??
      ({} as Character)
  );
  const [threadId, setThreadId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const dispatch = useAppDispatch();
  const [isAssistantWriting, setIsAssistantWriting] = useState<boolean>(false);

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "images" | "chat"
  >(isSmallScreen ? "chat" : "report");

  const characterSetThreadId = (threadId: string | null) => {
    setThreadId(threadId);
    dispatch(
      setChatLogAction({
        threadId,
        lastRequestId: lastRequestIdWaitingForThreadId,
      })
    );
  };

  const { sendMessage, getCharacter, socketConnection } = useWebSocket({
    setThreadId: characterSetThreadId,
  });

  const sendMessageToCharacter = (
    content: string,
    threadId: string | null,
    isPrivate: boolean
  ) => {
    sendMessage(content, "character", threadId, { isPrivate });
  };

  const handleViewTypeChange = (
    viewType: "report" | "json" | "images" | "chat"
  ) => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    setIsAssistantWriting(
      chatState?.isOwner ? !(chatState?.canSendMessage ?? true) : false
    );
  }, [chatState]);

  useEffect(() => {
    if (
      params.threadId &&
      params.threadId !== "new" &&
      threadId !== params.threadId
    ) {
      dispatch(
        setChatLogAction({
          threadId: params.threadId,
          isLoading: true,
          isInputAvailable: false,
        })
      );
      dispatch(
        setCharacter({
          thread_id: params.threadId,
          isImageProcessing: true,
          isReportProcessing: true,
        })
      );
      setThreadId(params.threadId);
    }
  }, [
    dispatch,
    getCharacter,
    getMessages,
    params.threadId,
    socketConnection?.readyState,
    threadId,
    isDataLoading,
  ]);

  useEffect(() => {
    if (
      params.threadId &&
      params.threadId !== "new" &&
      socketConnection?.readyState === WebSocket.OPEN &&
      ((!isDataLoading.includes("threads") &&
        !isDataLoading.includes("characters")) ||
        chatState?.isOwner)
    ) {
      getMessages(params.threadId);
      getCharacter(params.threadId);
    }
  }, [socketConnection?.readyState, isDataLoading, params.threadId]);

  useEffect(() => {
    if (threadId && location.pathname !== "/character/" + threadId) {
      navigate("/character/" + threadId);
      setThreadId(null);
    }
  }, [threadId]);

  useEffect(() => {
    if (chatLogState && params.threadId !== "new") setChatLog(chatLogState);
  }, [chatLogState, params.threadId]);

  useEffect(() => {
    if (params.threadId === "new") {
      setThreadId(null);
      setChatLog(newroleChat);
    }
  }, [newroleChat, params.threadId]);

  useEffect(() => {
    setThreadId(params.threadId !== "new" ? params.threadId ?? null : null);

    return () => {
      setThreadId(null);
    };
  }, []);

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
  }, [chatLog, selectedRightViewType]);

  return (
    <>
      <Meta title={character.json?.name ?? t("Character")} />
      <div className="grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll no-scrollbar h-full">
        {!isSmallScreen && (
          <div className="grow md:border-r-2 md:border-borderColor dark:md:border-darkBorderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll no-scrollbar h-full">
            <div
              className="grow overflow-y-scroll no-scrollbar justify-center flex h-full"
              ref={chatContainerRef}
            >
              <Chat
                type="character"
                id={threadId}
                chatLog={chatLog}
                isChatLoading={chatState?.isLoading ?? false}
                isAssistantWriting={isAssistantWriting}
              />
            </div>

            {params.threadId === "new" && (
              <div className="flex flex-row items-center mb-2">
                <input
                  type="checkbox"
                  value="1"
                  name="private"
                  id="private"
                  onChange={(e) => setNewIsPrivate(e.target.checked)}
                  checked={newIsPrivate}
                  disabled={plan === "free"}
                />
                <label htmlFor="private" className="ml-2">
                  {t("Set to private.")}
                </label>
                {plan === "free" && (
                  <div className="ml-2 font-bold">
                    <NavLink
                      onClick={() => sendEvent("click_upgrade", "character")}
                      to="/pricing"
                    >
                      {t("Upgrade plan")}
                    </NavLink>
                  </div>
                )}
              </div>
            )}
            {(chatState?.isOwner || params.threadId === "new") && (
              <div className="justify-center flex w-full md:px-0 px-[30px]">
                <SendChatInput
                  type="character"
                  threadId={threadId}
                  isChatInputAvailable={
                    chatState && !chatState?.isOwner
                      ? false
                      : chatState?.isInputAvailable ?? true
                  }
                  canSendMessage={
                    chatState && !chatState?.isOwner
                      ? false
                      : chatState?.canSendMessage ?? true
                  }
                  onSend={(message) =>
                    sendMessageToCharacter(message, threadId, newIsPrivate)
                  }
                />
              </div>
            )}
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
                    sendEvent("click_char_" + viewType, "character");
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
                      isAssistantWriting={
                        chatState?.canSendMessage
                          ? !chatState?.canSendMessage
                          : false
                      }
                    />
                  </div>
                  {params.threadId === "new" && (
                    <div className="flex flex-row items-center justify-center mb-2">
                      <input
                        type="checkbox"
                        value="1"
                        name="private"
                        id="private"
                        onChange={(e) => setNewIsPrivate(e.target.checked)}
                        checked={newIsPrivate}
                        disabled={plan === "free"}
                      />
                      <label htmlFor="private" className="ml-2">
                        {t("Set to private.")}
                      </label>
                      {plan === "free" && (
                        <div className="ml-2 font-bold">
                          <NavLink
                            onClick={() =>
                              sendEvent("click_upgrade", "character")
                            }
                            to="/pricing"
                          >
                            {t("Upgrade plan")}
                          </NavLink>
                        </div>
                      )}
                    </div>
                  )}
                  {(chatState?.isOwner || params.threadId === "new") && (
                    <div className="justify-center flex w-full md:px-0 px-[30px]">
                      <SendChatInput
                        type="character"
                        threadId={threadId}
                        isChatInputAvailable={
                          chatState && !chatState?.isOwner
                            ? false
                            : chatState?.isInputAvailable ?? true
                        }
                        canSendMessage={
                          chatState && !chatState?.isOwner
                            ? false
                            : chatState?.canSendMessage ?? true
                        }
                        onSend={(message) =>
                          sendMessageToCharacter(
                            message,
                            threadId,
                            newIsPrivate
                          )
                        }
                      />
                    </div>
                  )}
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
                <div className="w-full flex justify-center">
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
