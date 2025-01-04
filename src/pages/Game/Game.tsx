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

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { getThreadChatLog, getHeroActions, sendMessage, socketConnection } =
    useWebSocket({});
  const [threadId, setThreadId] = useState<string>();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const chatLog = useAppSelector(
    (state) =>
      state.app.chatLogs.find((log) => log.threadId === params.gameId)
        ?.chatLog ?? []
  );

  const chatState = useAppSelector((state) =>
    state.app.chatLogs.find((log) => log.threadId === params.gameId)
  );

  const heroActions = useAppSelector(
    (state) =>
      state.app.games.find((g) => g.threadId === params.gameId)?.heroActions
  );

  const game = useAppSelector((state) =>
    state.app.games.find((g) => g.threadId === params.gameId)
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
    if (location.pathname === "/game") {
      navigate("/game/new");
    }
  }, []);

  useEffect(() => {
    if (params.gameId) {
      setThreadId(params.gameId);
      dispatch(
        setChatLog({
          threadId: params.gameId,
          isInputAvailable: false,
          isLoading: true,
        })
      );
      if (socketConnection?.readyState === WebSocket.OPEN) {
        console.log("get thread chat log");
        dispatch(
          setGame({ threadId: params.gameId, heroActionsIsLoading: true })
        );
        getThreadChatLog(params.gameId);
        getHeroActions(params.gameId);
      }
    }
  }, [params.gameId, socketConnection?.readyState]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "game", objectId: params.gameId })
    );
  }, [params.gameId]);

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
    game?.heroActionsIsLoading,
    chatState?.isLoading,
    chatState?.canSendMessage,
  ]);

  return (
    <>
      <Meta title={t("You are the hero")} />
      <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)]">
          <div
            className="grow overflow-y-scroll no-scrollbar items-center flex flex-col"
            ref={chatContainerRef}
          >
            <Chat
              type="game"
              id={params.gameId}
              chatLog={chatLog}
              isChatLoading={chatState?.isLoading ?? false}
            />
            {!chatState?.isLoading &&
            !game?.heroActionsIsLoading &&
            (chatState?.canSendMessage ?? true) ? (
              <div className="grid md:grid-cols-2 grid-cols-1">
                {heroActions?.map((action) => (
                  <div
                    key={action.action_title}
                    className="flex flex-col p-[10px] m-[10px] rounded-lg border border-borderColor hover:bg-lightGray dark:hover:bg-darkLightGray cursor-pointer"
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
