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
import CloseIcon from "../../icons/close";

const Storypage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [imageViewing, setImageViewing] = useState<string | null>(null);

  const { sendMessage, getThreadChatLog, getStory, socketConnection } =
    useWebSocket({});

  const chatLog = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.storyId)
        ?.chatLog ?? []
  );

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.storyId)
  );

  const story = useAppSelector((state) =>
    state.app.stories.find((sto) => sto.threadId === params.storyId)
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
        getStory(params.storyId);
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
  }, [chatLog, chatState?.isLoading, chatState?.canSendMessage]);

  return (
    <>
      <Meta title={t(chatState?.title ?? "Story")} />
      <div
        className={clsx(
          { hidden: !imageViewing },
          "fixed h-[calc(100vh-60px)] w-[calc(100vw-60px)] top-[30px] left-[30px] bg-slate-200"
        )}
      >
        <div
          onClick={() => setImageViewing(null)}
          className="fixed top-[40px] right-[40px] h-[48px] w-[48px] cursor-pointer text-textSecondary dark:text-darkTextSecondary"
        >
          <CloseIcon />
        </div>
        {imageViewing && (
          <img
            className="h-full w-full object-contain"
            src={imageViewing}
            alt={imageViewing}
          />
        )}
      </div>
      <div className="flex justify-center h-full">
        <div className="grow pt-[10px] flex flex-col h-[calc(100vh-75px)]">
          <div
            className={clsx(
              {
                "h-[100px] min-h-[100px]":
                  story?.imagesSearch && story?.imagesSearch?.length > 0,
                "h-0 min-h-0":
                  !story?.imagesSearch || story?.imagesSearch?.length === 0,
              },
              "pl-[40px] pr-[40px] mb-[10px] duration-500 ease-in-out flex overflow-x-auto space-x-4 snap-x no-scrollbar"
            )}
          >
            {story?.imagesSearch.map((img) => {
              return (
                <div
                  onClick={() => setImageViewing(img.original)}
                  key={img.original}
                  className="h-[100px] flex-shrink-0 snap-center cursor-pointer"
                >
                  <img
                    src={img.thumbnail}
                    className="h-[100px] object-cover"
                    alt={img.entity}
                  />
                </div>
              );
            })}
          </div>
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
          {(chatState?.canSendMessage ?? true) &&
            chatState?.state !== "partial" &&
            chatState?.state !== "init" && (
              <div className="flex w-full justify-center">
                <div className="flex w-full max-w-[715px] text-end px-[40px] pb-[20px] pt-[10px] justify-end">
                  <div
                    onClick={() =>
                      sendMessage(t("Continue"), "story", threadId)
                    }
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

export default Storypage;
