import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import imageCarnalDuneon from "../../images/carnaldungeon.webp";
import imageSpySeduction from "../../images/spyseduction.webp";
import imageZombieLust from "../../images/zombielust.webp";
import imageForestOfDesires from "../../images/forestofdesires.webp";
import imageTimeOfPleasures from "../../images/timeofpleasures.webp";
import imageVampireNight from "../../images/vampirenight.webp";
import imageCyberPleasures from "../../images/cyberpleasures.webp";
import imageDesertTemptation from "../../images/deserttemptation.webp";
import imageHauntedDesires from "../../images/haunteddesires.webp";
import imagePiratesOfPassion from "../../images/piratesofpassion.webp";
import imageTreasureHunt from "../../images/treasurehunt.webp";
import imageAlienOdyssey from "../../images/alienodyssey.webp";
import imageEnchantedLibrary from "../../images/enchantedlibrary.webp";
import imageRobotRebellion from "../../images/robotrebellion.webp";
import imageMysticVoyage from "../../images/mysticvoyage.webp";

import SendIcon from "../../icons/send";
import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import AdultIcon from "../../icons/adult";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";

const games = [
  {
    id: "carnal_dungeon",
    image: imageCarnalDuneon.src,
    label: "Carnal Dungeon",
    adult: true,
    context:
      "You are a bold adventurer, descending into a dungeon ruled by the Succubus Queen. The air is thick with the scent of desire, and every chamber tests your deepest inhibitions. The queen herself awaits at the end, promising unbridled ecstasy if you can withstand her carnal challenges—or total submission if you cannot.",
  },
  {
    id: "spy_seduction",
    image: imageSpySeduction,
    label: "Spy Seduction",
    adult: true,
    context:
      "As a secret agent, you've been captured and find yourself at the mercy of a seductive interrogator. Each question is paired with temptations that blur the line between pleasure and pain. Will you resist their intoxicating allure and escape, or give in and reveal all in a haze of lust?",
  },
  {
    id: "zombie_lust",
    image: imageZombieLust,
    label: "Zombie Lust",
    adult: true,
    context:
      "In a world overtaken by an outbreak, you discover a secret refuge where survivors indulge in primal desires to stave off despair. Among them is a mysterious stranger who tempts you into forbidden pleasures. But be warned: some carry more than scars of survival—they may have secrets that will consume you.",
  },
  {
    id: "forest_of_desires",
    image: imageForestOfDesires,
    label: "Forest of Desires",
    adult: true,
    context:
      "Lost in an enchanted forest, you are seduced by nymphs who thrive on human passion. Each encounter pulls you deeper into their world of untamed lust. To leave, you must outwit their sensual games and prove you are worthy, or surrender and become their eternal plaything.",
  },
  {
    id: "time_of_pleasures",
    image: imageTimeOfPleasures,
    label: "Time of Pleasures",
    adult: true,
    context:
      "Thrown into a time loop, you find yourself revisiting moments of unspeakable desire. Each era offers new lovers, each more daring than the last. But indulging too much could trap you in a cycle of endless ecstasy, never to return to reality. Will you risk it all to savor every moment?",
  },
  {
    id: "vampire_night",
    image: imageVampireNight,
    label: "Vampire Night",
    adult: true,
    context:
      "In the heart of a shadowy manor, you encounter a coven of vampires who hunger not only for blood but also for carnal delights. Will you succumb to their dark seduction, or find a way to escape their eternal night of pleasure?",
  },
  {
    id: "cyber_pleasures",
    image: imageCyberPleasures,
    label: "Cyber Pleasures",
    adult: true,
    context:
      "In a neon-lit city of the future, you explore virtual realities where fantasies become reality. But as the lines between the digital and physical blur, will you lose yourself to the pleasures of the cyber world?",
  },
  {
    id: "desert_temptation",
    image: imageDesertTemptation,
    label: "Desert Temptation",
    adult: true,
    context:
      "Stranded in an endless desert, you encounter a caravan of sensual mystics who test your body and mind. Only those who embrace the heat of desire can uncover the oasis of ultimate ecstasy.",
  },
  {
    id: "haunted_desires",
    image: imageHauntedDesires,
    label: "Haunted Desires",
    adult: true,
    context:
      "In a crumbling mansion, spirits of forbidden lovers haunt your nights. They whisper promises of eternal pleasure but warn of the price: your soul. Will you resist their ghostly touch, or surrender to the afterlife of lust?",
  },
  {
    id: "pirates_of_passion",
    image: imagePiratesOfPassion,
    label: "Pirates of Passion",
    adult: true,
    context:
      "Captured by a crew of sensual pirates, you are drawn into their world of untamed lust and treasures. Will you claim the captain’s heart or remain their prisoner of desire?",
  },
  {
    id: "treasure_hunt",
    image: imageTreasureHunt,
    label: "Treasure Hunt",
    adult: false,
    context:
      "Join a band of adventurers searching for a legendary treasure hidden in a labyrinth filled with traps and puzzles. Each decision brings you closer to riches—or peril.",
  },
  {
    id: "alien_odyssey",
    image: imageAlienOdyssey,
    label: "Alien Odyssey",
    adult: false,
    context:
      "You find yourself aboard a mysterious alien spacecraft. To survive, you must navigate unknown technology and befriend—or outwit—the alien inhabitants.",
  },
  {
    id: "enchanted_library",
    image: imageEnchantedLibrary,
    label: "Enchanted Library",
    adult: false,
    context:
      "Lost in an ancient library, you discover books that transport you into magical worlds. Solve riddles and make choices to find your way back—or stay lost in the pages forever.",
  },
  {
    id: "robot_rebellion",
    image: imageRobotRebellion,
    label: "Robot Rebellion",
    adult: false,
    context:
      "In a futuristic city, robots have begun to rise against their human creators. As a young engineer, you must decide whether to aid their cause or fight to protect humanity.",
  },
  {
    id: "mystic_voyage",
    image: imageMysticVoyage,
    label: "Mystic Voyage",
    adult: false,
    context:
      "Sailing on a mysterious ship, you are swept into a world of mythical sea creatures and enchanted islands. Every decision shapes your destiny on the high seas.",
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
          <div className="grid grid-cols-5 md:w-[70%] w-full flex-wrap justify-center no-scrollbar">
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
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200 animate-pulse"></div>
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
            {games.map((game) => (
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
                    src={game.image}
                    className={clsx(
                      { "border-4 border-green-700": selectedGame === game.id },
                      "rounded-full h-[64px] w-[64px] object-cover"
                    )}
                  />
                  {game.adult && (
                    <div className="w-[24px] h-[24px] mt-[-15px] ml-[50px] text-textSecondary dark:text-darkTextSecondary">
                      <AdultIcon />
                    </div>
                  )}
                </div>
                <div className="text-textSecondary dark:text-darkTextSecondary text-center">
                  {t(game.label)}
                </div>
              </div>
            ))}
            {/* <div
            className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary dark:darkTextSecondary cursor-pointer self-center justify-self-center"
            onClick={() => setShowAIInput(true)}
          >
            <PlusIcon />
          </div> */}
          </div>
          {selectedGame && (
            <div className="text-textSecondary dark:text-darkTextSecondary text-center mt-[40px] md:w-[70%] w-full self-center justify-self-center rounded-lg bg-lightGray dark:bg-darkLightGray p-[20px]">
              {t(games.filter((g) => g.id === selectedGame)[0].context)}
            </div>
          )}
          <div className="pb-[40px]">
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
                  "bg-slate-200 dark:bg-darkTextSecondary":
                    !(selectedCharacters.length > 0) ||
                    !selectedGame ||
                    hasSentMessage,
                },
                "ml-[20px] w-[32px] h-[32px] mt-[40px] text-white rounded-full flex justify-center items-center"
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
      </div>
    </>
  );
};

export default NewGamePage;
