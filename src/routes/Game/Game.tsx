import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import Chat from "../../components/Chat";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setChatLog,
  setGame,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import LoadingIcon from "../../icons/loading";
import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";
import useAutoScroll from "../../hooks/useAutoScroll";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { getHeroActions, sendMessage, socketConnection } = useWebSocket({});
  const [threadId, setThreadId] = useState<string>();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { getMessages } = useAPI();
  const [isAssistantWriting, setIsAssistantWriting] = useState<boolean>(false);
  const { autoScroll } = useAutoScroll(chatContainerRef);

  const chatLog = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.threadId)
        ?.chatLog ?? []
  );

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.threadId)
  );

  const heroActions = useAppSelector(
    (state) =>
      state.app.games.find((g) => g.threadId === params.threadId)?.heroActions
  );

  const game = useAppSelector((state) =>
    state.app.games.find((g) => g.threadId === params.threadId)
  );

  const chooseAction = (actionTitle: string, actionDescription: string) => {
    if (threadId)
      sendMessage(
        `${actionTitle}: ${actionDescription}`,
        "you_are_the_hero",
        threadId
      );
  };

  useEffect(() => {
    setIsAssistantWriting(
      chatState?.isOwner ? !(chatState?.canSendMessage ?? true) : false
    );
  }, [chatState]);

  useEffect(() => {
    if (location.pathname === "/game") {
      navigate("/game/new");
    }
  }, []);

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
        dispatch(
          setGame({ threadId: params.threadId, heroActionsIsLoading: true })
        );
        getMessages(params.threadId);
        getHeroActions(params.threadId);
      }
    }
  }, [params.threadId, socketConnection?.readyState]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "game", objectId: params.threadId })
    );
  }, [params.threadId]);

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
    chatLog,
    game?.heroActionsIsLoading,
    chatState?.isLoading,
    chatState?.canSendMessage,
    autoScroll,
  ]);

  return (
    <>
      <Meta title={t(chatState?.title ?? "You are the hero")} />
      <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)]">
          <div
            className="grow overflow-y-scroll no-scrollbar items-center flex flex-col"
            ref={chatContainerRef}
          >
            <Chat
              type="game"
              id={params.threadId}
              chatLog={chatLog}
              isChatLoading={chatState?.isLoading ?? false}
              isAssistantWriting={isAssistantWriting}
            />
            {!chatState?.isLoading &&
            !game?.heroActionsIsLoading &&
            (chatState?.canSendMessage ?? true) ? (
              <div className="grid md:grid-cols-2 grid-cols-1">
                {heroActions?.map((action) => (
                  <div
                    key={action.action_title}
                    className="flex flex-col p-[10px] m-[10px] rounded-lg border border-borderColor dark:border-darkBorderColor hover:bg-lightGray dark:hover:bg-darkLightGray cursor-pointer"
                    onClick={() =>
                      chooseAction(
                        action.action_title,
                        action.action_description
                      )
                    }
                  >
                    <div className="group text-center">
                      {action.action_title}
                      <div className="text-textSecondary dark:text-darkTextSecondary text-sm">
                        {action.action_description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !chatState?.isLoading && game?.heroActionsIsLoading ? (
              <div className="h-[48px] w-[48px]">
                <LoadingIcon />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
