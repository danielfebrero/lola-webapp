import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { useParams, useNavigate, useLocation } from "react-router";
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
  setThread as setThreadAction,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import useGA from "../../hooks/useGA";
import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";
import { Character, CharacterServerData } from "../../types/characters";
import useAutoScroll from "../../hooks/useAutoScroll";
import { Message } from "../../types/chat";
import Vote from "../../components/Vote";

interface CharacterPageProps {
  selected?: Record<string, string>;
  serverData?: CharacterServerData;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { sendEvent } = useGA();
  const { plan } = useAppSelector((state) => state.user);
  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.threadId)
  );
  const [uncensored, setUncensored] = useState<boolean>(
    plan !== "free" &&
      (params.threadId === "new" || (chatState?.is_private ?? false))
  );
  const [newIsPrivate, setNewIsPrivate] = useState<boolean>(plan !== "free");
  const [shortMessage, setShortMessage] = useState<boolean>(true);
  const [genImage, setGenImage] = useState<boolean>(true);
  const { autoScroll } = useAutoScroll(chatContainerRef);
  const { getCharacter } = useAPI();

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

  const { isSmallScreen, lastRequestIdWaitingForThreadId, isDataLoading } =
    useAppSelector((state) => state.app);
  const character = useAppSelector(
    (state) =>
      state.app.characters.find((char) => char.thread_id === params.threadId) ??
      ({} as Character)
  );
  const [threadId, setThreadId] = useState<string | null>(null);
  const [chatLog, setThread] = useState<Message[]>([]);
  const [serverCharacter, setServerCharacter] =
    useState<CharacterServerData | null>(props.serverData ?? null);
  const dispatch = useAppDispatch();
  const [isAssistantWriting, setIsAssistantWriting] = useState<boolean>(false);

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "images" | "chat"
  >(isSmallScreen ? "chat" : "report");

  const characterSetThreadId = (threadId: string | null) => {
    setThreadId(threadId);
    dispatch(
      setThreadAction({
        threadId,
        lastRequestId: lastRequestIdWaitingForThreadId,
      })
    );
  };

  const { sendMessage, getClickedVotes, socketConnection } = useWebSocket({
    setThreadId: characterSetThreadId,
  });

  const sendMessageToCharacter = ({
    content,
    threadId,
    isPrivate,
    isShortMessage,
    turnOnImageGeneration,
    isUncensored,
  }: {
    content: string;
    threadId: string | null;
    isPrivate: boolean;
    isShortMessage: boolean;
    turnOnImageGeneration: boolean;
    isUncensored: boolean;
  }) => {
    sendMessage(content, "character", threadId, {
      isPrivate,
      isShortMessage,
      turnOnImageGeneration,
      isUncensored,
    });
  };

  const handleViewTypeChange = (
    viewType: "report" | "json" | "images" | "chat"
  ) => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    if (socketConnection?.readyState === WebSocket.OPEN) {
      getClickedVotes();
    }
  }, [socketConnection?.readyState]);

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
        setThreadAction({
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
  }, [dispatch, params.threadId, threadId]);

  useEffect(() => {
    if (
      params.threadId &&
      params.threadId !== "new" &&
      (isDataLoading.length === 0 || chatState?.isOwner)
    ) {
      getCharacter(params.threadId);
    }

    if (serverCharacter) {
      dispatch(
        setCharacter({
          ...serverCharacter,
          thread_id: serverCharacter.threadId,
          isReportProcessing: false,
          isImageProcessing: false,
        })
      );
      dispatch(
        setThreadAction({
          chatLog: serverCharacter.data.chatLog,
          threadId: serverCharacter.threadId,
          isInputAvailable: true,
          isLoading: false,
          type: "character",
        })
      );
      setServerCharacter(null);
    }
  }, [isDataLoading, params.threadId]);

  useEffect(() => {
    if (threadId && location.pathname !== "/character/" + threadId) {
      navigate("/character/" + threadId);
      setThreadId(null);
    }
  }, [threadId]);

  useEffect(() => {
    if (chatLogState && params.threadId !== "new") setThread(chatLogState);
  }, [chatLogState, params.threadId]);

  useEffect(() => {
    if (params.threadId === "new") {
      setThreadId(null);
      setThread(newroleChat);
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
    if (!autoScroll) return;
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [chatLog, autoScroll]);

  return (
    <>
      <Meta title={character.json?.name ?? t("New character")} />
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

            {(chatState?.isOwner || params.threadId === "new") && (
              <div className="justify-center flex w-full">
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
                    sendMessageToCharacter({
                      content: message,
                      threadId,
                      isPrivate: newIsPrivate,
                      isShortMessage: shortMessage,
                      turnOnImageGeneration: genImage,
                      isUncensored: uncensored,
                    })
                  }
                  canMakePrivate={plan !== "free"}
                  isPrivate={newIsPrivate}
                  showPrivate={params.threadId === "new"}
                  setPrivate={setNewIsPrivate}
                  showShortMessage={true}
                  setShortMessage={setShortMessage}
                  shortMessage={shortMessage}
                  showGenImage={params.threadId !== "new"}
                  setGenImage={setGenImage}
                  genImage={genImage}
                  showUncensored={plan !== "free" && params.threadId === "new"}
                  setUncensored={setUncensored}
                  uncensored={uncensored}
                />
              </div>
            )}
            {!chatState?.isOwner && params.threadId !== "new" && chatState && (
              <div className="flex flex-row w-full">
                <div
                  className="grow mr-[20px] rounded-full border border-borderColor dark:border-darkBorderColor text-center py-[5px] cursor-pointer"
                  onClick={() => navigate("/character/new")}
                >
                  {t("Create a character")}
                </div>
                <Vote thread={chatState} />
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

                  {(chatState?.isOwner || params.threadId === "new") && (
                    <div className="justify-center flex md:max-w-[715px] w-[100%]">
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
                          sendMessageToCharacter({
                            content: message,
                            threadId,
                            isPrivate: newIsPrivate,
                            isShortMessage: shortMessage,
                            turnOnImageGeneration: genImage,
                            isUncensored: uncensored,
                          })
                        }
                        canMakePrivate={plan !== "free"}
                        showPrivate={params.threadId === "new"}
                        setPrivate={setNewIsPrivate}
                        isPrivate={newIsPrivate}
                        showShortMessage={true}
                        setShortMessage={setShortMessage}
                        shortMessage={shortMessage}
                        showGenImage={params.threadId !== "new"}
                        setGenImage={setGenImage}
                        genImage={genImage}
                        showUncensored={
                          plan !== "free" && params.threadId === "new"
                        }
                        setUncensored={setUncensored}
                        uncensored={uncensored}
                      />
                    </div>
                  )}
                  {!chatState?.isOwner &&
                    params.threadId !== "new" &&
                    chatState && (
                      <div className="flex flex-row w-full">
                        <div
                          className="grow mr-[20px] rounded-full border border-borderColor dark:border-darkBorderColor text-center py-[5px] cursor-pointer"
                          onClick={() => navigate("/character/new")}
                        >
                          {t("Create a character")}
                        </div>
                        <Vote thread={chatState} />
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
                    avatar={character.avatar}
                    imagesMultisize={character.imagesMultisize}
                    isProcessing={character.isReportProcessing ?? false}
                    isImageGenerating={character.isImageProcessing ?? false}
                    summary={character.summary}
                    isImageUploading={character.isImageUploading ?? false}
                    isOwner={chatState?.isOwner ?? false}
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
                    avatar={character.avatar}
                    isOwner={chatState?.isOwner ?? false}
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
