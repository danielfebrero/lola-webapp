import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

import Meta from "../../components/Meta";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Chat from "../../components/Chat";
import CreateChatGroup from "./CreateChatGroup";
import useAutoScroll from "../../hooks/useAutoScroll";
import ExploreChatGroups from "./ExploreChatGroups";
import ArrowBackIcon from "../../icons/arrowBack";
import LeaveIcon from "../../icons/leave";
import ExploreIcon from "../../icons/explore";
import NewChatIcon from "../../icons/newChat";
import SpreadIcon from "../../icons/spread";
import {
  setCurrentlyViewing,
  mergeThreads,
  deleteChatGroup as deleteChatGroupAction,
  setThread,
  setChatGroup,
  mergeChatGroups,
} from "../../store/features/app/appSlice";
import useAPI from "../../hooks/useAPI";
import { ChatGroup } from "../../types/chatGroup";
import { Thread } from "../../types/chat";
import { arrayOfObjectsSnakeToCamelDeep } from "../../utils/string";
import DeleteIcon from "../../icons/delete";
import useClickAnywhereExcept from "../../hooks/useClickAnywhereExcept";
import Loading from "../../components/Loading";
import SendChatInput from "../../components/SendChatInput";
import useWebSocket from "../../hooks/useWebSocket";

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { isSmallScreen, chatGroups, mode } = useAppSelector(
    (state) => state.app
  );
  const threads = useAppSelector((state) => state.app.chatLogs);
  const { autoScroll } = useAutoScroll(chatContainerRef);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [isChatGroupsLoading, setIsChatGroupsLoading] = useState(false);
  const [previousPage, setPreviousPage] = useState<"explore" | "new" | null>(
    null
  );
  const [currentGroup, setCurrentGroup] = useState<ChatGroup | null>(null);
  const {
    getChatGroups,
    deleteChatGroup,
    leaveChatGroup,
    getChatGroup,
    joinChatGroup,
  } = useAPI();
  const chatGroupOptionsRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage } = useWebSocket({});

  const threadId = params.threadId;
  const currentThread = useMemo(
    () => threads.find((thread: Thread) => thread.threadId === threadId),
    [threadId, threads]
  );
  const currentChatLog = useMemo(() => currentThread?.chatLog, [currentThread]);
  const isAssistantWriting = currentThread?.isOwner
    ? !(currentThread?.canSendMessage ?? true)
    : false;

  useClickAnywhereExcept(chatGroupOptionsRef, () => {
    setIsMoreOptionsOpen(false);
  });

  const getChatGroupFn = async () => {
    if (!threadId) return;
    dispatch(setThread({ threadId, isLoading: true }));
    try {
      const chatGroupEntity = await getChatGroup(threadId);
      dispatch(setChatGroup(chatGroupEntity.chat_group));
      setCurrentGroup(chatGroupEntity.chat_group);
      dispatch(
        setThread({ ...chatGroupEntity.thread, threadId, isLoading: false })
      );
    } catch (e) {
      navigate("/social/chat");
    }
  };

  const handleJoinGroup = async () => {
    if (!threadId) return;
    dispatch(setThread({ threadId, isLoading: true }));
    await joinChatGroup(threadId);
    await getChatGroupFn();
    dispatch(setThread({ threadId, isLoading: false }));
  };

  const handleLeaveGroup = async () => {
    if (!threadId) return;
    dispatch(setThread({ threadId, isLoading: true }));
    await leaveChatGroup(threadId);
    dispatch(deleteChatGroupAction(threadId));
    setIsMoreOptionsOpen(false);
    navigate("/social/chat");
  };

  const handleDeleteGroup = async () => {
    if (!threadId) return;
    dispatch(setThread({ threadId, isLoading: true }));
    await deleteChatGroup(threadId);
    dispatch(deleteChatGroupAction(threadId));
    setIsMoreOptionsOpen(false);
    navigate("/social/chat");
  };

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    if (params.threadId) return;
    setIsChatGroupsLoading(true);
    const getJoinedChatGroupsList = async () => {
      const joinedChatGroupsList = await getChatGroups("joined");
      dispatch(
        mergeChatGroups(
          arrayOfObjectsSnakeToCamelDeep(joinedChatGroupsList.chat_groups)
        )
      );
      dispatch(mergeThreads(joinedChatGroupsList.threads));
      setIsChatGroupsLoading(false);
    };

    getJoinedChatGroupsList();
  }, [mode, auth.isAuthenticated, params.threadId]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    dispatch(
      setCurrentlyViewing({ objectType: "chat_group", objectId: threadId })
    );

    if (threadId === "explore" || threadId === "new") setPreviousPage(threadId);
    if (!threadId) setPreviousPage(null);

    if (!threadId || threadId === "new" || threadId === "explore") return;
    getChatGroupFn();
  }, [threadId, auth.isAuthenticated]);

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
  }, [
    currentChatLog,
    // chatState?.isLoading,
    // chatState?.canSendMessage,
    // isAssistantWriting,
    autoScroll,
  ]);

  return (
    <>
      <Meta title={t("Chat")} />
      <div className="grow pt-2.5 pb-2.5 flex flex-row">
        <div className="grow flex flex-row h-[calc(100vh-90px)] max-w-full">
          <div
            className={clsx(
              {
                "w-full": isSmallScreen,
                "w-[320px]": !isSmallScreen,
                hidden: params.threadId && isSmallScreen,
              },
              "flex flex-col h-full border-r border-borderColor dark:border-darkBorderColor overflow-y-scroll no-scrollbar"
            )}
          >
            <div className="w-full flex items-center justify-center">
              <div
                onClick={() => navigate("/social/chat/explore")}
                className="flex flex-row px-[10px] py-[5px] border border-borderColor dark:border-darkBorderColor rounded-lg w-fit cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary items-center"
              >
                <div className="w-[18px] h-[18px] mr-[10px]">
                  <ExploreIcon />
                </div>
                <div className="text-textSecondary dark:text-darkTextSecondary">
                  {t("Explore")}
                </div>
              </div>
              <div
                onClick={() =>
                  auth.isAuthenticated
                    ? navigate("/social/chat/new")
                    : auth.signinRedirect()
                }
                className="flex flex-row px-[10px] py-[5px] ml-[10px] border border-borderColor dark:border-darkBorderColor rounded-lg w-fit cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary items-center"
              >
                <div className="w-[18px] h-[18px] mr-[10px]">
                  <NewChatIcon />
                </div>
                <div className="text-textSecondary dark:text-darkTextSecondary">
                  {t("Create")}
                </div>
              </div>
            </div>
            {isChatGroupsLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loading />
              </div>
            ) : (
              chatGroups
                ?.filter((group: ChatGroup) => group.hasJoined)
                ?.filter((group: ChatGroup) =>
                  threads.find(
                    (thread: Thread) => thread.threadId === group.threadId
                  )
                )
                ?.map((group: ChatGroup) => {
                  const isActive = threadId === group.threadId;
                  return (
                    <div
                      key={group.threadId}
                      className={clsx(
                        "flex flex-row items-center m-2 p-2.5 rounded-lg transition-all duration-200 border",
                        isActive
                          ? "bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected border-textOptionSelected dark:border-darkTextOptionSelected"
                          : "border-transparent hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary",
                        "cursor-pointer"
                      )}
                      onClick={() => navigate(`/social/chat/${group.threadId}`)}
                    >
                      <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 shadow-sm bg-brandMainColorDarker dark:bg-darkBrandMainColorDarker">
                        <img
                          src={group.imagesMultisize?.large}
                          alt={threads
                            .find(
                              (thread: Thread) =>
                                thread.threadId === group.threadId
                            )
                            ?.title?.substring(0, 2)
                            .toUpperCase()}
                          className="w-full h-full object-cover justify-center items-center flex"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://picsum.photos/id/0/120/120";
                          }}
                        />
                      </div>
                      <div className="flex flex-col ml-3 flex-grow">
                        <div
                          className={clsx(
                            "font-medium truncate",
                            {
                              "w-[220px]": !isSmallScreen,
                              "w-[calc(100vw-120px)]": isSmallScreen,
                            },
                            isActive
                              ? "text-textOptionSelected dark:text-darkTextOptionSelected"
                              : "text-textPrimary dark:text-darkTextPrimary"
                          )}
                        >
                          {
                            threads.find(
                              (thread: Thread) =>
                                thread.threadId === group.threadId
                            )?.title
                          }
                        </div>
                        <div className="text-textSecondary dark:text-darkTextSecondary text-xs mt-0.5 flex items-center">
                          <span className="truncate">
                            {group.lastMessageDate &&
                              moment(group.lastMessageDate).fromNow()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
          {(!params.threadId || params.threadId === "explore") &&
            (!isSmallScreen ||
              (isSmallScreen && params.threadId === "explore")) && (
              <div className="flex flex-col flex-grow">
                {isSmallScreen && params.threadId === "explore" && (
                  <div
                    className="w-[24px] h-[24px] ml-[20px] mb-[10px] cursor-pointer"
                    onClick={() => navigate("/social/chat")}
                  >
                    <ArrowBackIcon />
                  </div>
                )}
                <div className="flex flex-col flex-grow overflow-y-scroll no-scrollbar w-full items-center">
                  <ExploreChatGroups />
                </div>
              </div>
            )}
          {threadId === "new" && (
            <div className="flex flex-col items-center flex-grow min-w-0 p-[10px] overflow-y-scroll no-scrollbar">
              <CreateChatGroup />
            </div>
          )}
          {threadId && threadId !== "new" && threadId !== "explore" && (
            <div className="flex flex-col flex-grow">
              <div className="flex flex-row justify-between mb-[10px]">
                <div
                  className="w-[24px] h-[24px] ml-[20px] cursor-pointer"
                  onClick={() =>
                    previousPage === null || previousPage === "new"
                      ? navigate("/social/chat")
                      : navigate("/social/chat/explore")
                  }
                >
                  <ArrowBackIcon />
                </div>

                <div ref={chatGroupOptionsRef}>
                  <div
                    onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
                    className="mr-[20px] w-[24px] h-[24px] border border-borderColor dark:border-darkBorderColor rounded-full flex items-center justify-center cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                  >
                    <SpreadIcon />
                  </div>
                  {isMoreOptionsOpen && (
                    <div className="absolute right-0 mt-[10px] mr-[20px] w-[150px] bg-white dark:bg-darkMainSurfacePrimary border border-borderColor dark:border-darkBorderColor rounded-lg shadow-lg z-10">
                      <div
                        className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                        onClick={handleLeaveGroup}
                      >
                        <div className="w-[18px] h-[18px] mr-[10px]">
                          <LeaveIcon />
                        </div>
                        <span>{t("Leave")}</span>
                      </div>
                      {currentThread?.isOwner && (
                        <div
                          className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                          onClick={() => handleDeleteGroup()}
                        >
                          <div className="w-[18px] h-[18px] mr-[10px]">
                            <DeleteIcon />
                          </div>
                          <span>{t("Delete")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex flex-col flex-grow overflow-y-scroll no-scrollbar px-[10px] items-center w-full flex-grow"
              >
                <div
                  className="flex-grow overflow-y-scroll no-scrollbar w-full"
                  ref={chatContainerRef}
                >
                  <Chat
                    type="chat_group"
                    id={threadId}
                    chatLog={currentChatLog ?? []}
                    isChatLoading={currentThread?.isLoading ?? false}
                    isAssistantWriting={isAssistantWriting}
                  />
                </div>
                {currentGroup?.hasJoined && (
                  <SendChatInput
                    type="chat_group"
                    isChatInputAvailable={
                      currentThread?.isInputAvailable ?? true
                    }
                    canSendMessage={currentThread?.canSendMessage ?? true}
                    threadId={threadId}
                    onSend={(content) =>
                      sendMessage(content, "chat_group", threadId)
                    }
                  />
                )}
              </div>
              {!currentGroup?.hasJoined && !currentThread?.isLoading && (
                <div className="w-full flex justify-center pt-[10px]">
                  <div
                    onClick={handleJoinGroup}
                    className="cursor-pointer w-fit px-[20px] py-[5px] border border-borderColor dark:border-darkBorderColor rounded-lg flex flex-row items-center hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                  >
                    {t("Join")}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
