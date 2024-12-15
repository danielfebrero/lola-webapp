import { useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";

import imageDani from "../../dani.webp";
import imageLola from "../../lola.jpeg";

import SendIcon from "../../icons/send";
import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";

const characters = [
  {
    id: "random",
    label: "Random",
    image: imageDani,
  },
  {
    id: "2329890kj09-claire",
    label: "Claire",
    image: imageLola,
  },
  {
    id: "dani01",
    label: "Dani",
    image: imageDani,
  },
];

const games = [
  {
    id: "dungeon",
    label: "Dungeon",
    context:
      "You are a daring prince or princess tasked with defeating the legendary dragon, Karzareth, who has hoarded a treasure that holds the fate of your kingdom. Armed with a blade forged in starlight, you must navigate through dark, treacherous caverns filled with traps, riddles, and cursed creatures. Beware: every decision could either inch you closer to glory or seal your doom.",
  },
  {
    id: "spy_escape",
    label: "Spy Escape",
    context:
      "You are an undercover agent trapped in an enemy facility after your cover was blown. The clock is ticking, and you have just 24 hours to evade capture, retrieve classified intel, and find an extraction point. Trust no one, choose your gadgets wisely, and decide who to betray to survive.",
  },
  {
    id: "zombie_apocalypse",
    label: "Zombie Apocalypse",
    context:
      "The world has crumbled, and you are one of the last survivors of a global zombie outbreak. In a sprawling urban wasteland, you must gather resources, protect your group, and unravel the mystery of the virus. Will you fight for humanity’s survival, or carve out your own selfish path?",
  },
  {
    id: "space_odyssey",
    label: "Space Odyssey",
    context:
      "As the captain of a space exploration vessel, your mission to find a habitable planet takes an unexpected turn when an ancient alien race awakens. You must navigate interstellar politics, hostile environments, and cryptic alien technology to secure humanity's future—or risk becoming part of the stars' forgotten history.",
  },
  {
    id: "enchanted_forest",
    label: "Enchanted Forest",
    context:
      "You are a wandering bard who stumbles upon an ancient, enchanted forest. The spirits of the forest offer you unimaginable power, but only if you solve their riddles and prove your worth. Will you use this power for good, or succumb to the allure of dark magic and rule the land with an iron fist?",
  },
  {
    id: "time_paradox",
    label: "Time Paradox",
    context:
      "A mysterious device has thrown you into a chaotic loop of timelines. As a time-traveler, your choices will shape the past, present, and future. Every action could ripple across centuries, creating new alliances—or enemies. Can you solve the paradox and restore balance before time itself unravels?",
  },
];

const NewGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("");

  const createGame = () => {
    navigate("/game/098DF098SDFQ08F-dani-tome-1");
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="flex flex-col items-center">
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
        <div className="font-semibold text-lg mb-[20px]">Chose a hero</div>
        <div className="flex flex-row">
          {characters.map((char) => (
            <div
              className="flex flex-col items-center mx-[10px] cursor-pointer"
              onClick={() => {
                selectedCharacters.includes(char.id)
                  ? setSelectedCharacters(
                      selectedCharacters.filter((id) => id !== char.id)
                    )
                  : setSelectedCharacters([...selectedCharacters, char.id]);
              }}
            >
              <div className="h-[64px] w-[64px] mb-[10px]">
                <img
                  src={char.image}
                  className={clsx(
                    {
                      "border-4 border-green-700": selectedCharacters.includes(
                        char.id
                      ),
                    },
                    "rounded-full h-[64px] w-[64px] object-cover"
                  )}
                />
              </div>
              <div className="text-textSecondary">{char.label}</div>
            </div>
          ))}
        </div>
        <div className="font-semibold text-lg mt-[40px] mb-[20px]">
          Chose a game
        </div>
        <div className="grid gap-4 grid-cols-5">
          {games.map((game) => (
            <div
              className="flex flex-col items-center mx-[10px] cursor-pointer w-auto"
              onClick={() => {
                setSelectedGame(game.id);
              }}
            >
              <div className="h-[64px] w-[64px] mb-[10px]">
                <img
                  src={imageDani}
                  className={clsx(
                    { "border-4 border-green-700": selectedGame === game.id },
                    "rounded-full h-[64px] w-[64px] object-cover"
                  )}
                />
              </div>
              <div className="text-textSecondary text-center">{game.label}</div>
            </div>
          ))}
          <div
            className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary cursor-pointer"
            onClick={() => setShowAIInput(true)}
          >
            <PlusIcon />
          </div>
        </div>
        <div
          className="ml-[20px] w-[32px] h-[32px] text-white bg-black rounded-full flex justify-center items-center cursor-pointer"
          onClick={createGame}
        >
          <SendIcon />
        </div>
      </div>
    </div>
  );
};

export default NewGamePage;
