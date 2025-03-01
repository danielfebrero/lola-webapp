import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import SendIcon from "../../icons/send";
import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setThread,
  setCurrentlyViewing,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";

const NewGamePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const games = useAppSelector((state) => state.games.scenarios);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [locale, setLocale] = useState<string>("en");
  const dispatch = useAppDispatch();
  const { characters, lastRequestIdWaitingForThreadId, mode } = useAppSelector(
    (state) => state.app
  );
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const gameSetThreadId = (threadId: string | null) => {
    setThreadId(threadId);
    dispatch(
      setThread({
        threadId,
        lastRequestId: lastRequestIdWaitingForThreadId,
      })
    );
  };

  const { sendMessage } = useWebSocket({
    setThreadId: gameSetThreadId,
  });

  const { getCharacters, getGameScenarios } = useAPI();

  const createGame = () => {
    sendMessage("", "you_are_the_hero", null, {
      hero: selectedCharacters[0],
      context: games[selectedGame ?? 0].scenario_locales[locale],
      adult: games[selectedGame ?? 0].mode === "adult",
    });
    setHasSentMessage(true);
  };

  useEffect(() => {
    const charId = searchParams.get("characterId");
    if (charId && games.length > 0) {
      setSelectedCharacters([charId]);
      setSelectedGame(0);
    }
  }, [games, searchParams]);

  useEffect(() => {
    const charId = searchParams.get("characterId");
    if (charId && selectedCharacters.includes(charId) && games.length > 0) {
      createGame();
    }
  }, [selectedCharacters, searchParams, games]);

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: "game", objectId: null }));
  }, [dispatch]);

  useEffect(() => {
    getCharacters();
    getGameScenarios();
  }, [mode]);

  useEffect(() => {
    if (threadId) {
      navigate("/game/" + threadId);
    }
  }, [threadId]);

  // Scroll to the bottom when selectedGame changes
  useEffect(() => {
    if (bottomRef.current && selectedGame !== null) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedGame]);

  // Scroll to the bottom when selectedGame changes
  useEffect(() => {
    if (bottomRef.current && selectedCharacters.length > 0) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedCharacters]);

  useEffect(() => {
    if (
      Object.keys(games[0]?.scenario_locales ?? []).includes(
        i18n.language.substring(0, 2)
      )
    )
      setLocale(i18n.language.substring(0, 2));
  }, [i18n.language, games]);

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
          <div className="grid md:grid-cols-5 grid-cols-3 w-full flex-wrap justify-center">
            {characters.map((char) => (
              <div
                className="flex flex-col items-center m-[10px] cursor-pointer"
                onClick={() => {
                  selectedCharacters.includes(char.thread_id)
                    ? setSelectedCharacters([])
                    : setSelectedCharacters([char.thread_id]);
                }}
              >
                {characters.find((c) => c.thread_id === char.thread_id)
                  ?.imagesMultisize?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      alt={char.name}
                      src={
                        characters.find((c) => c.thread_id === char.thread_id)
                          ?.avatar?.medium ??
                        characters.find((c) => c.thread_id === char.thread_id)
                          ?.imagesMultisize?.[0].medium
                      }
                      className={clsx(
                        {
                          "border-4 border-brandMainColor dark:border-darkBrandMainColor":
                            selectedCharacters.includes(char.thread_id),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={clsx(
                      {
                        "border-4 border-brandMainColor dark:border-darkBrandMainColor":
                          selectedCharacters.includes(char.thread_id),
                      },
                      "h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200 animate-pulse"
                    )}
                  ></div>
                )}

                <div className="text-textSecondary dark:text-darkTextSecondary text-center">
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
            {t("Choose a scenario")}
          </div>
          <div className="grid md:grid-cols-5 grid-cols-3 w-full flex-wrap justify-center">
            {games.map((game, idx) => (
              <div
                className="flex flex-col items-center m-[10px] cursor-pointer w-auto"
                onClick={() => {
                  setSelectedGame((prev) => (prev === idx ? null : idx));
                }}
              >
                <div className="h-[64px] w-[64px] mb-[10px]">
                  <img
                    src={game.images_multisize.medium}
                    alt={game.title_locales[locale]}
                    className={clsx(
                      {
                        "border-4 border-brandMainColor dark:border-darkBrandMainColor":
                          selectedGame === idx,
                      },
                      "rounded-full h-[64px] w-[64px] object-cover"
                    )}
                  />
                </div>
                <div className="text-textSecondary dark:text-darkTextSecondary text-center">
                  {game.title_locales[locale]}
                </div>
              </div>
            ))}
          </div>
          {selectedGame !== null && (
            <div className="text-textSecondary dark:text-darkTextSecondary text-center mt-[40px] md:w-[70%] w-full self-center justify-self-center rounded-lg bg-lightGray dark:bg-darkLightGray p-[20px]">
              {t(games[selectedGame].scenario_locales[locale])}
            </div>
          )}
          <div className="pb-[60px]">
            <div
              onClick={
                selectedCharacters.length > 0 &&
                selectedGame !== null &&
                !hasSentMessage
                  ? createGame
                  : undefined
              }
              className={clsx(
                {
                  "cursor-pointer":
                    selectedCharacters.length > 0 &&
                    selectedGame !== null &&
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
                      selectedGame !== null &&
                      !hasSentMessage,
                    "bg-textSecondary dark:bg-darkTextSecondary":
                      !(selectedCharacters.length > 0) ||
                      selectedGame === null ||
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
