import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setChatLog,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";
import clsx from "clsx";
import ImageViewer from "../../components/ImageViewer/ImageViewer";
import useGA from "../../hooks/useGA";
import useAPI from "../../hooks/useAPI";

const Storypage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { sendEvent } = useGA();
  const [isAssistantWriting, setIsAssistantWriting] = useState<boolean>(false);

  const { sendMessage, getStory, socketConnection } = useWebSocket({});

  const { getMessages } = useAPI();

  const chatLog = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.threadId)
        ?.chatLog ?? []
  );

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.threadId)
  );

  const story = useAppSelector((state) =>
    state.app.stories.find((sto) => sto.threadId === params.threadId)
  );

  useEffect(() => {
    setIsAssistantWriting(
      chatState?.isOwner ? !(chatState?.canSendMessage ?? true) : false
    );
  }, [chatState]);

  useEffect(() => {
    if (params.threadId) {
      setThreadId(params.threadId);
      dispatch(
        setChatLog({
          threadId: params.threadId,
          isInputAvailable: false,
          isLoading: true,
        })
      );
      if (socketConnection?.readyState === WebSocket.OPEN) {
        console.log("get thread chat log");
        getMessages(params.threadId);
        getStory(params.threadId);
      }
    }
  }, [params.threadId, socketConnection?.readyState]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({
        objectType: "story",
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
    }, 0);
    return () => clearTimeout(timer);
  }, [
    chatLog,
    chatState?.isLoading,
    chatState?.canSendMessage,
    isAssistantWriting,
  ]);

  return (
    <>
      <Meta title={t(chatState?.title ?? "Story")} />

      <div className="flex justify-center h-full">
        <div className="grow pt-[10px] flex flex-col h-[calc(100vh-75px)]">
          <div
            className={clsx(
              {
                "h-[100px] min-h-[100px]":
                  story?.image_search_results &&
                  story?.image_search_results?.length > 0,
                "h-0 min-h-0":
                  !story?.image_search_results ||
                  story?.image_search_results?.length === 0,
              },
              "transition-all duration-500 pl-[40px] pr-[40px] mb-[10px]"
            )}
          >
            {story?.image_search_results && (
              <ImageViewer images={story?.image_search_results} />
            )}
          </div>
          <div
            ref={chatContainerRef}
            className="grow overflow-y-scroll no-scrollbar justify-center flex px-5"
          >
            <Chat
              type="story"
              id={params.threadId}
              chatLog={chatLog}
              isChatLoading={chatState?.isLoading ?? false}
              isAssistantWriting={isAssistantWriting}
            />
          </div>
          {chatState?.isOwner &&
            (chatState?.canSendMessage ?? true) &&
            chatState?.state !== "partial" &&
            chatState?.state !== "init" && (
              <div className="flex w-full justify-center">
                <div className="flex w-full max-w-[715px] text-end px-[40px] pb-[20px] pt-[10px] justify-end">
                  <div
                    onClick={() => {
                      sendMessage(t("Continue"), "story", threadId);
                      sendEvent("clicked_on_continue_from_story");
                    }}
                    className="rounded-lg p-[15px] py-[7px] w-fit border border-borderColor dark:border-darkBorderColor hover:bg-lightGray dark:hover:bg-darkLightGray cursor-pointer"
                  >
                    {t("Continue")}
                  </div>
                </div>
              </div>
            )}

          <div className="justify-center flex w-full">
            <div className="md:max-w-[715px] w-[100%] px-[30px]">
              <SendChatInput
                type="story"
                onSend={(message) => sendMessage(message, "story", threadId)}
                canSendMessage={
                  chatState?.isOwner ? chatState?.canSendMessage ?? true : false
                }
                isChatInputAvailable={
                  chatState?.isOwner
                    ? chatState?.isInputAvailable ?? true
                    : false
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Storypage;
