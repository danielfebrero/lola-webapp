import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import SendIcon from "../../icons/send";
import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import Adult16Icon from "../../icons/adult16";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";

const NewGamePage: React.FC = () => {
  const { t } = useTranslation();
  const games = useAppSelector((state) => state.games.scenarios);

  const navigate = useNavigate();
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { characters, mode } = useAppSelector((state) => state.app);
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { sendMessage, getCharacters, socketConnection } = useWebSocket({
    setThreadId,
  });

  const createGame = () => {
    sendMessage("", "you_are_the_hero", null, {
      hero: selectedCharacters[0],
      context: t(games.filter((g) => g.id === selectedGame)[0].context),
      adult: games.filter((g) => g.id === selectedGame)[0].adult,
    });
    setHasSentMessage(true);
  };

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: "game", objectId: null }));
  }, [dispatch]);

  useEffect(() => {
    if (socketConnection?.readyState === WebSocket.OPEN) {
      getCharacters();
    }
  }, [socketConnection?.readyState]);

  useEffect(() => {
    if (threadId) {
      navigate("/game/" + threadId);
    }
  }, [threadId]);

  // Scroll to the bottom when selectedGame changes
  useEffect(() => {
    if (bottomRef.current && selectedGame) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedGame]);

  return (
    <>
      <Meta title={t("New game")} />
      <div
        ref={bottomRef}
        className="flex flex-col h-full justify-center items-center overflow-y-scroll no-scrollbar pt-[30px] md:pt-0"
      >
        <div className="flex flex-col items-center w-full h-full md:pt-[30px]">
          <div
            className={clsx(
              { hidden: !showAIInput },
              "absolute top-[50px] w-[calc(100%-260px)] h-[calc(100%-50px)] bg-white flex flex-col justify-center items-center"
            )}
          >
            <div className="flex justify-end w-[60%]">
              <div
                className="h-[24px] w-[24px] m-[10px] cursor-pointer"
                onClick={() => setShowAIInput(false)}
              >
                <CloseIcon />
              </div>
            </div>
            <input
              type="text"
              placeholder="Describe the kind of game you want to play"
              className="w-[60%] outline-none border rounded-full p-[10px]"
              onKeyDown={(e) => e.key === "Enter" && setShowAIInput(false)}
            />
          </div>
          <div className="font-semibold text-lg mb-[20px]">
            {t("Choose a hero")}
          </div>
          <div className="grid md:grid-cols-5 grid-cols-3 md:w-[70%] w-full flex-wrap justify-center no-scrollbar">
            {characters.map((char) => (
              <div
                className="flex flex-col items-center m-[10px] cursor-pointer"
                onClick={() => {
                  selectedCharacters.includes(char.threadId)
                    ? setSelectedCharacters([])
                    : setSelectedCharacters([char.threadId]);
                }}
              >
                {characters.find((c) => c.threadId === char.threadId)
                  ?.imagesMultisize?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      alt={char.name}
                      src={
                        characters.find((c) => c.threadId === char.threadId)
                          ?.imagesMultisize?.[0].medium
                      }
                      className={clsx(
                        {
                          "border-4 border-green-700":
                            selectedCharacters.includes(char.threadId),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : characters.find((c) => c.threadId === char.threadId)
                    ?.images?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      alt={char.name}
                      src={
                        characters.find((c) => c.threadId === char.threadId)
                          ?.images?.[0]
                      }
                      className={clsx(
                        {
                          "border-4 border-green-700":
                            selectedCharacters.includes(char.threadId),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={clsx(
                      {
                        "border-4 border-green-700":
                          selectedCharacters.includes(char.threadId),
                      },
                      "h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200 animate-pulse"
                    )}
                  ></div>
                )}

                <div className="text-textSecondary dark:text-darkTextSecondary">
                  {char.json?.name}
                </div>
              </div>
            ))}
            <NavLink
              to={"/character/new"}
              className="flex items-center justify-center"
            >
              <div className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary dark:text-darkTextSecondary cursor-pointer flex">
                <PlusIcon />
              </div>
            </NavLink>
          </div>
          <div className="font-semibold text-lg mt-[40px] mb-[20px]">
            {t("Choose a game")}
          </div>
          <div className="grid gap-4 md:grid-cols-5 grid-cols-3 px-[30px]">
            {games
              .filter((g) =>
                mode === "adult" ? g.adult === true : g.adult === false
              )
              .map((game) => (
                <div
                  className="flex flex-col items-center mx-[10px] cursor-pointer w-auto"
                  onClick={() => {
                    setSelectedGame((prev) =>
                      prev === game.id ? null : game.id
                    );
                  }}
                >
                  <div className="h-[64px] w-[64px] mb-[10px]">
                    <img
                      src={game.image.src}
                      alt={game.label}
                      className={clsx(
                        {
                          "border-4 border-green-700": selectedGame === game.id,
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                  <div className="text-textSecondary dark:text-darkTextSecondary text-center">
                    {t(game.label)}
                  </div>
                </div>
              ))}
          </div>
          {selectedGame && (
            <div className="text-textSecondary dark:text-darkTextSecondary text-center mt-[40px] md:w-[70%] w-full self-center justify-self-center rounded-lg bg-lightGray dark:bg-darkLightGray p-[20px]">
              {t(games.filter((g) => g.id === selectedGame)[0].context)}
            </div>
          )}
          <div className="pb-[60px]">
            <div
              onClick={
                selectedCharacters.length > 0 && selectedGame && !hasSentMessage
                  ? createGame
                  : undefined
              }
              className={clsx(
                {
                  "cursor-pointer":
                    selectedCharacters.length > 0 &&
                    selectedGame &&
                    !hasSentMessage,
                },
                "py-[5px] px-[10px] bg-lightGray dark:bg-darkLightGray rounded-lg flex flex-row mt-[40px] items-center border border-borderLight dark:border-darkBorderLight"
              )}
            >
              <div className="mr-[10px]">{t("Start")}</div>
              <div
                className={clsx(
                  {
                    "bg-black":
                      selectedCharacters.length > 0 &&
                      selectedGame &&
                      !hasSentMessage,
                    "bg-textSecondary dark:bg-darkTextSecondary":
                      !(selectedCharacters.length > 0) ||
                      !selectedGame ||
                      hasSentMessage,
                  },
                  "w-[32px] h-[32px]  text-white rounded-full flex justify-center items-center"
                )}
              >
                <SendIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewGamePage;
