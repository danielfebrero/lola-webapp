import { createSlice } from "@reduxjs/toolkit";

import imageCarnalDuneon from "../../../images/carnaldungeon.webp";
import imageSpySeduction from "../../../images/spyseduction.webp";
import imageZombieLust from "../../../images/zombielust.webp";
import imageForestOfDesires from "../../../images/forestofdesires.webp";
import imageTimeOfPleasures from "../../../images/timeofpleasures.webp";
import imageVampireNight from "../../../images/vampirenight.webp";
import imageCyberPleasures from "../../../images/cyberpleasures.webp";
import imageDesertTemptation from "../../../images/deserttemptation.webp";
import imageHauntedDesires from "../../../images/haunteddesires.webp";
import imagePiratesOfPassion from "../../../images/piratesofpassion.webp";
import imageTreasureHunt from "../../../images/treasurehunt.webp";
import imageAlienOdyssey from "../../../images/alienodyssey.webp";
import imageEnchantedLibrary from "../../../images/enchantedlibrary.webp";
import imageRobotRebellion from "../../../images/robotrebellion.webp";
import imageMysticVoyage from "../../../images/mysticvoyage.webp";
import { Scenario } from "../../../types/games";
import { StaticImageData } from "next/image";

// Define a type for the slice state
interface AppState {
  scenarios: Scenario[];
}

// Define the initial state using that type
const initialState: AppState = {
  scenarios: [
    {
      id: "carnal_dungeon",
      image: imageCarnalDuneon as unknown as StaticImageData,
      label: "Carnal Dungeon",
      adult: true,
      context:
        "You are a bold adventurer, descending into a dungeon ruled by the Succubus Queen. The air is thick with the scent of desire, and every chamber tests your deepest inhibitions. The queen herself awaits at the end, promising unbridled ecstasy if you can withstand her carnal challenges—or total submission if you cannot.",
    },
    {
      id: "spy_seduction",
      image: imageSpySeduction as unknown as StaticImageData,
      label: "Spy Seduction",
      adult: true,
      context:
        "As a secret agent, you've been captured and find yourself at the mercy of a seductive interrogator. Each question is paired with temptations that blur the line between pleasure and pain. Will you resist their intoxicating allure and escape, or give in and reveal all in a haze of lust?",
    },
    {
      id: "zombie_lust",
      image: imageZombieLust as unknown as StaticImageData,
      label: "Zombie Lust",
      adult: true,
      context:
        "In a world overtaken by an outbreak, you discover a secret refuge where survivors indulge in primal desires to stave off despair. Among them is a mysterious stranger who tempts you into forbidden pleasures. But be warned: some carry more than scars of survival—they may have secrets that will consume you.",
    },
    {
      id: "forest_of_desires",
      image: imageForestOfDesires as unknown as StaticImageData,
      label: "Forest of Desires",
      adult: true,
      context:
        "Lost in an enchanted forest, you are seduced by nymphs who thrive on human passion. Each encounter pulls you deeper into their world of untamed lust. To leave, you must outwit their sensual games and prove you are worthy, or surrender and become their eternal plaything.",
    },
    {
      id: "time_of_pleasures",
      image: imageTimeOfPleasures as unknown as StaticImageData,
      label: "Time of Pleasures",
      adult: true,
      context:
        "Thrown into a time loop, you find yourself revisiting moments of unspeakable desire. Each era offers new lovers, each more daring than the last. But indulging too much could trap you in a cycle of endless ecstasy, never to return to reality. Will you risk it all to savor every moment?",
    },
    {
      id: "vampire_night",
      image: imageVampireNight as unknown as StaticImageData,
      label: "Vampire Night",
      adult: true,
      context:
        "In the heart of a shadowy manor, you encounter a coven of vampires who hunger not only for blood but also for carnal delights. Will you succumb to their dark seduction, or find a way to escape their eternal night of pleasure?",
    },
    {
      id: "cyber_pleasures",
      image: imageCyberPleasures as unknown as StaticImageData,
      label: "Cyber Pleasures",
      adult: true,
      context:
        "In a neon-lit city of the future, you explore virtual realities where fantasies become reality. But as the lines between the digital and physical blur, will you lose yourself to the pleasures of the cyber world?",
    },
    {
      id: "desert_temptation",
      image: imageDesertTemptation as unknown as StaticImageData,
      label: "Desert Temptation",
      adult: true,
      context:
        "Stranded in an endless desert, you encounter a caravan of sensual mystics who test your body and mind. Only those who embrace the heat of desire can uncover the oasis of ultimate ecstasy.",
    },
    {
      id: "haunted_desires",
      image: imageHauntedDesires as unknown as StaticImageData,
      label: "Haunted Desires",
      adult: true,
      context:
        "In a crumbling mansion, spirits of forbidden lovers haunt your nights. They whisper promises of eternal pleasure but warn of the price: your soul. Will you resist their ghostly touch, or surrender to the afterlife of lust?",
    },
    {
      id: "pirates_of_passion",
      image: imagePiratesOfPassion as unknown as StaticImageData,
      label: "Pirates of Passion",
      adult: true,
      context:
        "Captured by a crew of sensual pirates, you are drawn into their world of untamed lust and treasures. Will you claim the captain’s heart or remain their prisoner of desire?",
    },
    {
      id: "treasure_hunt",
      image: imageTreasureHunt as unknown as StaticImageData,
      label: "Treasure Hunt",
      adult: false,
      context:
        "Join a band of adventurers searching for a legendary treasure hidden in a labyrinth filled with traps and puzzles. Each decision brings you closer to riches—or peril.",
    },
    {
      id: "alien_odyssey",
      image: imageAlienOdyssey as unknown as StaticImageData,
      label: "Alien Odyssey",
      adult: false,
      context:
        "You find yourself aboard a mysterious alien spacecraft. To survive, you must navigate unknown technology and befriend—or outwit—the alien inhabitants.",
    },
    {
      id: "enchanted_library",
      image: imageEnchantedLibrary as unknown as StaticImageData,
      label: "Enchanted Library",
      adult: false,
      context:
        "Lost in an ancient library, you discover books that transport you into magical worlds. Solve riddles and make choices to find your way back—or stay lost in the pages forever.",
    },
    {
      id: "robot_rebellion",
      image: imageRobotRebellion as unknown as StaticImageData,
      label: "Robot Rebellion",
      adult: false,
      context:
        "In a futuristic city, robots have begun to rise against their human creators. As a young engineer, you must decide whether to aid their cause or fight to protect humanity.",
    },
    {
      id: "mystic_voyage",
      image: imageMysticVoyage as unknown as StaticImageData,
      label: "Mystic Voyage",
      adult: false,
      context:
        "Sailing on a mysterious ship, you are swept into a world of mythical sea creatures and enchanted islands. Every decision shapes your destiny on the high seas.",
    },
  ],
};

export const gamesSlice = createSlice({
  name: "games",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export default gamesSlice.reducer;
