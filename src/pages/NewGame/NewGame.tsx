import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import imageDani from "../../images/dani.webp";
import imageCarnalDuneon from "../../images/carnaldungeon.webp";
import imageSpySeduction from "../../images/spyseduction.webp";
import imageZombieLust from "../../images/zombielust.webp";
import imageForestOfDesires from "../../images/forestofdesires.webp";
import imageTimeOfPleasures from "../../images/timeofpleasures.webp";

import SendIcon from "../../icons/send";
import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

const games = [
  {
    id: "carnal_dungeon",
    image: imageCarnalDuneon,
    label: "Carnal Dungeon",
    context:
      "You are a bold adventurer, descending into a dungeon ruled by the Succubus Queen. The air is thick with the scent of desire, and every chamber tests your deepest inhibitions. The queen herself awaits at the end, promising unbridled ecstasy if you can withstand her carnal challenges—or total submission if you cannot.",
  },
  {
    id: "spy_seduction",
    image: imageSpySeduction,
    label: "Spy Seduction",
    context:
      "As a secret agent, you've been captured and find yourself at the mercy of a seductive interrogator. Each question is paired with temptations that blur the line between pleasure and pain. Will you resist their intoxicating allure and escape, or give in and reveal all in a haze of lust?",
  },
  {
    id: "zombie_lust",
    image: imageZombieLust,
    label: "Zombie Lust",
    context:
      "In a world overtaken by an outbreak, you discover a secret refuge where survivors indulge in primal desires to stave off despair. Among them is a mysterious stranger who tempts you into forbidden pleasures. But be warned: some carry more than scars of survival—they may have secrets that will consume you.",
  },
  {
    id: "forest_of_desires",
    image: imageForestOfDesires,
    label: "Forest of Desires",
    context:
      "Lost in an enchanted forest, you are seduced by nymphs who thrive on human passion. Each encounter pulls you deeper into their world of untamed lust. To leave, you must outwit their sensual games and prove you are worthy, or surrender and become their eternal plaything.",
  },
  {
    id: "time_of_pleasures",
    image: imageTimeOfPleasures,
    label: "Time of Pleasures",
    context:
      "Thrown into a time loop, you find yourself revisiting moments of unspeakable desire. Each era offers new lovers, each more daring than the last. But indulging too much could trap you in a cycle of endless ecstasy, never to return to reality. Will you risk it all to savor every moment?",
  },
];

const NewGamePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { characters } = useAppSelector((state) => state.app);
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const { sendMessage, getCharacters, socketConnection } = useWebSocket({
    setThreadId,
  });

  const createGame = () => {
    sendMessage("", "you_are_the_hero", null, {
      hero: selectedCharacters[0],
      context: t(games.filter((g) => g.id === selectedGame)[0].context),
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

  return (
    <div className="flex flex-col h-full justify-center items-center overflow-y-scroll no-scrollbar pt-[30px] md:pt-0">
      <div className="flex flex-col items-center w-full h-full justify-center">
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
        <div className="flex flex-row overflow-x-scroll md:w-[70%] w-full flex-wrap justify-center no-scrollbar">
          {characters.map((char) => (
            <div
              className="flex flex-col items-center mx-[10px] cursor-pointer"
              onClick={() => {
                selectedCharacters.includes(char.threadId)
                  ? setSelectedCharacters([])
                  : setSelectedCharacters([char.threadId]);
              }}
            >
              <div className="h-[64px] w-[64px] mb-[10px]">
                <img
                  src={
                    characters.find((c) => c.threadId === char.threadId)
                      ?.images?.[0] ?? imageDani
                  }
                  className={clsx(
                    {
                      "border-4 border-green-700": selectedCharacters.includes(
                        char.threadId
                      ),
                    },
                    "rounded-full h-[64px] w-[64px] object-cover"
                  )}
                />
              </div>
              <div className="text-textSecondary">{char.json?.name}</div>
            </div>
          ))}
          <NavLink to={"/character/new"}>
            <div className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary cursor-pointer flex">
              <PlusIcon />
            </div>
          </NavLink>
        </div>
        <div className="font-semibold text-lg mt-[40px] mb-[20px]">
          {t("Choose a game")}
        </div>
        <div className="grid gap-4 md:grid-cols-5 grid-cols-3 px-[30px]">
          {games.map((game) => (
            <div
              className="flex flex-col items-center mx-[10px] cursor-pointer w-auto"
              onClick={() => {
                setSelectedGame((prev) => (prev === game.id ? null : game.id));
              }}
            >
              <div className="h-[64px] w-[64px] mb-[10px]">
                <img
                  src={game.image}
                  className={clsx(
                    { "border-4 border-green-700": selectedGame === game.id },
                    "rounded-full h-[64px] w-[64px] object-cover"
                  )}
                />
              </div>
              <div className="text-textSecondary text-center">
                {t(game.label)}
              </div>
            </div>
          ))}
          {/* <div
            className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary cursor-pointer self-center justify-self-center"
            onClick={() => setShowAIInput(true)}
          >
            <PlusIcon />
          </div> */}
        </div>
        {selectedGame && (
          <div className="text-textSecondary text-center mt-[40px] md:w-[70%] w-full self-center justify-self-center rounded-lg bg-lightGray p-[20px]">
            {t(games.filter((g) => g.id === selectedGame)[0].context)}
          </div>
        )}
        <div
          className={clsx(
            {
              "cursor-pointer":
                selectedCharacters.length > 0 &&
                selectedGame &&
                !hasSentMessage,
              "bg-black":
                selectedCharacters.length > 0 &&
                selectedGame &&
                !hasSentMessage,
              "bg-slate-200":
                !(selectedCharacters.length > 0) ||
                !selectedGame ||
                hasSentMessage,
            },
            "ml-[20px] w-[32px] h-[32px] mt-[40px] text-white bg-black rounded-full flex justify-center items-center "
          )}
          onClick={
            selectedCharacters.length > 0 && selectedGame && !hasSentMessage
              ? createGame
              : undefined
          }
        >
          <SendIcon />
        </div>
      </div>
    </div>
  );
};

export default NewGamePage;
