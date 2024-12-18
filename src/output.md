path: /Users/dannybengal/dev/lola/webapp/src/App.test.tsx
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

path: /Users/dannybengal/dev/lola/webapp/src/App.tsx
```tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Overlay from "./components/Overlay";
import Settings from "./components/Settings";

import CharacterPage from "./pages/Character";
import GamePage from "./pages/Game";
import StoryPage from "./pages/Story";
import NewStoryPage from "./pages/NewStory";
import NewGamePage from "./pages/NewGame";

import { store } from "./store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Overlay>
          <Settings />
        </Overlay>
        <div className="app text-textPrimary flex flex-row">
          <LeftPanel />
          <div className="flex flex-col h-screen overflow-y-scroll w-full z-10 bg-white">
            <div className="flex flex-col grow overflow-y-scroll">
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/character/main" replace />}
                />
                <Route
                  path="/character/main"
                  element={<CharacterPage selected={{ type: "main" }} />}
                />
                <Route
                  path="/character/:characterId"
                  element={<CharacterPage />}
                />
                <Route path="/game" element={<GamePage />} />
                <Route path="/game/new" element={<NewGamePage />} />
                <Route path="/game/:gameId" element={<GamePage />} />
                <Route path="/story/:storyId" element={<StoryPage />} />
                <Route path="/story/new" element={<NewStoryPage />} />
              </Routes>
            </div>
            <div className="flex w-full">
              <Footer />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/Chat.tsx
```tsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import imageLola from "../../lola.jpeg";
import imageDani from "../../dani.webp";
import clsx from "clsx";

interface ChatProps {
  type: "character" | "story" | "game";
  id?: string;
}

const newCharacterChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    character: "dani",
  },
];

const characterChat = [
  {
    content:
      "She sat alone in her dimly lit apartment, the hum of the city outside barely audible over the storm of thoughts in her mind. What happened to me? she wondered, her fingers tracing the edge of her coffee mug. Just days ago, she had been lost in the monotony of her routine, her creativity strangled by self-doubt. And then, she had stumbled into Muse. That gallery, that man—Andre. His words still lingered in her mind, wrapping around her like a taut thread she couldn’t untangle. He saw something in me, she thought, her cheeks warming at the memory of his gaze, steady and piercing. She had painted that night, not just with her hands but with her heart, spilling emotions she didn’t even know she’d buried. It had been terrifying, raw, and somehow freeing. But what now? she questioned, staring at the blank canvas she had brought home. The ache in her chest whispered that this was only the beginning.",
    character: "cara",
  },
  {
    content: "You should buy some new lingerie.",
    character: "user",
  },
  {
    content:
      "As she glanced at her reflection in the mirror, a playful smirk tugged at her lips. You know what? I’m going to buy myself some new lingerie—something bold, something that feels as daring as I want to be.",
    character: "cara",
  },
  {
    content:
      "She sat alone in her dimly lit apartment, the hum of the city outside barely audible over the storm of thoughts in her mind. What happened to me? she wondered, her fingers tracing the edge of her coffee mug. Just days ago, she had been lost in the monotony of her routine, her creativity strangled by self-doubt. And then, she had stumbled into Muse. That gallery, that man—Andre. His words still lingered in her mind, wrapping around her like a taut thread she couldn’t untangle. He saw something in me, she thought, her cheeks warming at the memory of his gaze, steady and piercing. She had painted that night, not just with her hands but with her heart, spilling emotions she didn’t even know she’d buried. It had been terrifying, raw, and somehow freeing. But what now? she questioned, staring at the blank canvas she had brought home. The ache in her chest whispered that this was only the beginning.",
    character: "cara",
  },
  {
    content: "You should buy some new lingerie.",
    character: "user",
  },
  {
    content:
      "As she glanced at her reflection in the mirror, a playful smirk tugged at her lips. You know what? I’m going to buy myself some new lingerie—something bold, something that feels as daring as I want to be.",
    character: "cara",
  },
];

const story = [
  {
    content:
      "The city hummed with a subtle vibrancy as Cara walked briskly through the rain-slicked streets, her canvas bag slung over one shoulder. She had spent the last two days aimlessly sketching at a café, frustrated by her inability to channel her usual inspiration. The world around her felt dim, her creativity dulled by the weight of routine and self-doubt.",
    character: "narrator",
  },
  {
    content:
      "She paused under the awning of a gallery she’d never noticed before. The name 'Muse' was etched elegantly in black script across frosted glass doors. A faint pulse of bass came from within, an almost magnetic rhythm that drew her closer. It felt out of place, this unassuming storefront hiding something far more alive within its depths. Curiosity prickled at her, and before she could overthink, she stepped inside.",
    character: "narrator",
  },
  {
    content:
      "The scent of sandalwood and faint vanilla hit her first, rich and intoxicating. The lighting was low, accented by soft candles that danced against the dark, earthy walls. A few scattered patrons sipped wine, murmuring softly as they gazed at abstract art pieces that felt more visceral than intellectual. A striking figure leaned casually against a far wall, their dark eyes gleaming in the flickering light.",
    character: "narrator",
  },
  {
    content: "“Looking for something… or someone?”",
    character: "andre",
  },
  {
    content:
      "“I—just wandered in,” she admitted, suddenly aware of her soaked jacket and the slight flush on her cheeks.",
    character: "cara",
  },
  {
    content:
      "“Then you’re exactly where you’re supposed to be.” The stranger stepped closer, offering a sly smile. “I’m Andre.”",
    character: "andre",
  },
  {
    content:
      "“Cara,” she replied, her voice catching in her throat as his gaze traveled over her, lingering not with judgement but with curiosity, as though he could read her restlessness like an open book.",
    character: "cara",
  },
  {
    content:
      "Andre gestured toward the back of the gallery, where a velvet curtain hung partially open. “Let me show you something,” he said.",
    character: "andre",
  },
  {
    content:
      "Before she could protest, he was leading her into a room that felt entirely separate from the one they’d just left. Here, the air was heavier, thick with a tension that made her pulse quicken. The walls were lined with canvases depicting moments of intimacy so raw they felt almost intrusive. Bodies entwined in shadowy suggestion, faces caught in expressions of pure abandon.",
    character: "narrator",
  },
  {
    content:
      "“What… is this place?” she whispered, her fingers brushing lightly against the edge of a frame.",
    character: "cara",
  },
  {
    content:
      "Andre tilted his head, studying her. “It’s a sanctuary for those who seek something deeper. You see, art isn’t just about paint on a canvas. It’s about emotion, vulnerability. Submission, even.”",
    character: "andre",
  },
  {
    content:
      "The word hit her like a bolt of lightning. Submission. Her mind spiraled, unbidden images flashing of herself yielding, giving up control to someone who could see through her guarded layers.",
    character: "narrator",
  },
  {
    content:
      "“You look like someone who could use inspiration,” Andre murmured, stepping closer, his voice a low thrum against her skin. “Tell me, Cara… do you trust yourself enough to let go?”",
    character: "andre",
  },
  {
    content:
      "Her lips parted, but no words came. She felt the heat of his proximity, the intoxicating pull of his presence. He reached out, his fingertips ghosting along the edge of her jaw.",
    character: "narrator",
  },
  {
    content:
      "“I can help you find what you’re looking for,” he said, his voice soft but firm. “But only if you’re willing to surrender to the experience.”",
    character: "andre",
  },
  {
    content:
      "Her heart thundered in her chest. She didn’t know what compelled her to nod, but when she did, Andre’s lips curved into a knowing smile.",
    character: "narrator",
  },
  {
    content:
      "“Good,” he said. “Come back tomorrow night. Bring nothing but yourself. And leave the rest to me.”",
    character: "andre",
  },
  {
    content: "Make them fuck",
    character: "user",
  },
  {
    content:
      "The rain had stopped when Cara stepped out of the gallery, the cool night air brushing against her flushed cheeks. Her mind raced with questions, Andre's words echoing in her head. 'Surrender to the experience.' What did that even mean? And why had she agreed so readily?",
    character: "narrator",
  },
  {
    content:
      "The following day felt like a blur. Cara wandered aimlessly through her apartment, unable to focus on her sketches or her usual routines. She kept replaying the encounter, Andre's enigmatic smile and the intensity of his gaze.",
    character: "narrator",
  },
  {
    content:
      "That evening, Cara found herself standing outside the gallery once again. She hesitated, her fingers trembling as they gripped the strap of her bag. She had left everything else behind, just as he had instructed. But now, the weight of the unknown pressed heavily on her chest.",
    character: "narrator",
  },
  {
    content:
      "The door opened before she could make a decision. Andre stood there, dressed sharply in a tailored jacket, his expression one of quiet confidence. 'I was wondering if you'd come,' he said, stepping aside to let her in.",
    character: "andre",
  },
  {
    content:
      "Cara nodded, unable to find her voice. She stepped past him, the familiar scent of sandalwood and vanilla wrapping around her like a veil. The gallery was dimly lit, its usual patrons absent. Only the faint pulse of music remained, a haunting melody that seemed to guide her steps.",
    character: "narrator",
  },
  {
    content:
      "'Follow me,' Andre said, his tone softer now, almost reassuring. He led her past the velvet curtain once more, into the intimate room she had seen the night before. But this time, the space felt different—charged, alive.",
    character: "andre",
  },
  {
    content:
      "In the center of the room was an easel, a blank canvas waiting to be transformed. Andre gestured toward it. 'Tonight, we create together,' he said. 'No limits, no hesitation. Let your instincts guide you.'",
    character: "andre",
  },
  {
    content:
      "Cara hesitated, the weight of his words sinking in. 'I don't even know where to start,' she admitted, her voice barely above a whisper.",
    character: "cara",
  },
  {
    content:
      "'Start with yourself,' Andre replied. 'Strip away the fear, the doubt. Let the canvas see who you really are.'",
    character: "andre",
  },
  {
    content:
      "Her breath caught, the vulnerability of his request striking her deeply. Slowly, she stepped forward, her fingers trembling as they reached for the brush. Andre moved closer, his presence steady and grounding. Together, they began to paint, the strokes raw and unfiltered, their emotions bleeding onto the canvas.",
    character: "narrator",
  },
  {
    content:
      "As the night wore on, the lines between creation and connection blurred. Cara found herself letting go in ways she never imagined possible, her trust in Andre growing with every shared glance, every whispered word of encouragement.",
    character: "narrator",
  },
  {
    content:
      "When they finally stepped back to admire their work, the canvas was alive with color and texture—a reflection of everything she had been too afraid to express. Andre's hand rested lightly on her shoulder, his voice low and sincere. 'This is just the beginning,' he said.",
    character: "andre",
  },
  {
    content:
      "Cara nodded, a small smile playing on her lips. For the first time in what felt like forever, she felt truly inspired.",
    character: "narrator",
  },
  {
    content:
      "This feels like a good step forward for their connection, but maybe there’s room to push it further later? What do you think?",
    character: "user",
  },
];

const Chat: React.FC<ChatProps> = (props) => {
  const [chatLog, setChatLog] = useState(characterChat);
  const location = useLocation();

  useEffect(() => {
    props.id === "new"
      ? setChatLog(newCharacterChat)
      : props.id === "qsqf909Ddsdf-a-random-story"
      ? setChatLog(story)
      : setChatLog(characterChat);
  }, [props]);

  return (
    <div className="w-full max-w-[715px]">
      <div className="w-full flex">
        <div className="w-auto grow mb-[30px]">
          {chatLog.map((message) =>
            message.character === "user" ? (
              <div className="flex flex-row justify-end mb-[20px]">
                <div
                  className={clsx(
                    {
                      "max-w-[60%]": location.pathname.indexOf("/story") === 0,
                      "max-w-[80%]": location.pathname.indexOf("/story") !== 0,
                    },
                    "w-fit  bg-messageBackground rounded-lg p-[10px]"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-row mb-[10px]">
                <div className="w-[30px] h-[30px] mr-[10px]">
                  {message.character !== "narrator" ? (
                    <img
                      className="rounded-full h-[30px] w-[30px] object-cover"
                      src={message.character === "cara" ? imageLola : imageDani}
                    />
                  ) : null}
                </div>
                <div className="grow max-w-[calc(100%-50px)]">
                  {message.content}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/index.ts
```ts
import Chat from "./Chat";

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/Footer.tsx
```tsx
const Footer: React.FC = () => {
  return (
    <div className="w-full text-center">
      Lola is a storyteller. Everything is fictive.
    </div>
  );
};

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/index.ts
```ts
import Footer from "./Footer";

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/Header.tsx
```tsx
import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import ChevronDown from "../../icons/chevronDown";
import ModeDropdown from "../ModeDropdown";
import ProfileDropdown from "../ProfileDropdown";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import ShareIcon from "../../icons/share";

const Header: React.FC = () => {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("Main character");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);
  const currentlyViewing = useAppSelector(
    (state) => state.app.currentlyViewing
  );
  const newChatLocation = useNewChatLocation();

  const toggleModeDropdown = () => {
    setModeDropdownOpen(!modeDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  useEffect(() => {
    location.pathname.indexOf("/character/main") === 0
      ? setHeaderLabel("Main character")
      : location.pathname.indexOf("/character/new") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/character") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/game/new") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/game") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/story/new") === 0
      ? setHeaderLabel("Story")
      : location.pathname.indexOf("/story") === 0
      ? setHeaderLabel("Story")
      : setHeaderLabel("Story");
    setModeDropdownOpen(false);
  }, [location]);

  return (
    <div className="pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between">
      <div className="w-auto h-auto">
        <div className="flex flex-row items-center">
          {!isLeftPanelOpen ? (
            <div className="flex flex-row text-textSecondary">
              <div
                className="h-[24px] w-[24px] cursor-pointer mr-[10px]"
                onClick={() => dispatch(toggleLeftPanel())}
              >
                <PanelIcon />
              </div>
              <NavLink to={newChatLocation}>
                <div className="h-[24px] w-[24px]  mr-[10px]">
                  <NewChatIcon />
                </div>
              </NavLink>
            </div>
          ) : null}
          <div
            className="h-[40px] items-center flex flex-row text-textSecondary cursor-pointer"
            onClick={toggleModeDropdown}
          >
            <span className="font-bold">{headerLabel}</span>
            <div className="h-[24px] w-[24px]">
              <ChevronDown />
            </div>
          </div>
        </div>
        <div className={clsx({ hidden: !modeDropdownOpen })}>
          <ModeDropdown hide={() => setModeDropdownOpen(false)} />
        </div>
      </div>
      <div className="flex flex-row">
        {currentlyViewing.objectId &&
        currentlyViewing.objectType === "story" ? (
          <div>
            <button className="pl-[10px] pr-[10px] p-[5px] border border-borderColor rounded-full mr-[10px] hover:bg-lightGray">
              <div className="flex flex-row items-center">
                <div className="h-[20px] w-[20px] mr-[10px]">
                  <ShareIcon />
                </div>
                <span>Share</span>
              </div>
            </button>
          </div>
        ) : null}
        <div
          className="bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer"
          onClick={toggleProfileDropdown}
        >
          D
        </div>
        <div className={clsx({ hidden: !profileDropdownOpen })}>
          <ProfileDropdown hide={() => setProfileDropdownOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/index.ts
```ts
import Header from "./Header";

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/LeftPanel.tsx
```tsx
import { NavLink } from "react-router";
import clsx from "clsx";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import PlusIcon from "../../icons/plus";
import imageDani from "../../dani.webp";
import imageClaire from "../../lola.jpeg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";

const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const newChatLocation = useNewChatLocation();
  const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);

  const characters = [
    {
      id: "dani01",
      label: "Dani",
      type: "main",
      image: imageDani,
    },
    {
      id: "2329890kj09-claire",
      label: "Claire",
      image: imageClaire,
    },
  ];

  const stories = [
    {
      id: "qsqf909Ddsdf-a-random-story",
      label: "A random story",
    },
  ];

  const games = [
    {
      id: "098DF098SDFQ08F-dani-tome-1",
      label: "Dani Tome 1",
    },
  ];

  return (
    <div
      className={clsx(
        {
          "w-[260px]": isLeftPanelOpen,
          "w-0": !isLeftPanelOpen,
        },
        `transition-all duration-500`
      )}
    >
      <div className="h-screen w-[260px] bg-lightGray flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary">
            <div
              className="h-[24px] w-[24px] cursor-pointer"
              onClick={() => dispatch(toggleLeftPanel())}
            >
              <PanelIcon />
            </div>
            <NavLink to={newChatLocation}>
              <div className="h-[24px] w-[24px]">
                <NewChatIcon />
              </div>
            </NavLink>
          </div>
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div>Characters</div>
            {characters.length > 0 ? (
              <NavLink to="/character/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          {characters.length == 0 ? (
            <NavLink to="/character/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New character</span>
              </div>
            </NavLink>
          ) : (
            characters.map((char) => (
              <NavLink
                to={
                  char.type === "main"
                    ? "/character/main"
                    : `/character/${char.id}`
                }
              >
                <div className="flex flex-row items-center h-[40px] hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                  <div className="h-[24px] w-[24px]">
                    <img
                      src={char.image}
                      className="rounded-full h-[24px] w-[24px] object-cover"
                    />
                  </div>
                  <span className="pl-[10px]">{char.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div className="font-bold h-[40px] content-center">Games</div>
            {games.length > 0 ? (
              <NavLink to="/game/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          {games.length === 0 ? (
            <NavLink to="/game/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New game</span>
              </div>
            </NavLink>
          ) : (
            games.map((game) => (
              <NavLink to={`/game/${game.id}`}>
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <span className="">{game.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div className="font-bold h-[40px] content-center">Stories</div>
            {stories.length > 0 ? (
              <NavLink to="/story/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          {stories.length === 0 ? (
            <NavLink to="/story/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New story</span>
              </div>
            </NavLink>
          ) : (
            stories.map((story) => (
              <NavLink to={`/story/${story.id}`}>
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <span className="">{story.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/index.ts
```ts
import LeftPanel from "./LeftPanel";

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/ModeDropdown.tsx
```tsx
import { NavLink, useLocation } from "react-router";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";

interface ModeDropdownProps {
  hide: () => void;
}

const ModeDropdown: React.FC<ModeDropdownProps> = (props) => {
  const location = useLocation();

  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[320px]"
    >
      <NavLink
        to={
          location.pathname.indexOf("/character") == 0
            ? location.pathname
            : "/character/main"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Character</div>
            <div className="text-textSecondary text-xs">
              Take care of your characters
            </div>
          </div>
          {location.pathname.indexOf("/character") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/game") == 0 ? location.pathname : "/game"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>You are the hero</div>
            <div className="text-textSecondary text-xs">Play the game</div>
          </div>
          {location.pathname.indexOf("/game") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/story") == 0
            ? location.pathname
            : "/story/new"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Story</div>
            <div className="text-textSecondary text-xs">You are the author</div>
          </div>
          {location.pathname.indexOf("/story") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/index.ts
```ts
import ModeDropdown from "./ModeDropdown";

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Overlay/Overlay.tsx
```tsx
import clsx from "clsx";
import { useAppSelector } from "../../store/hooks";

interface OverlayProps {
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const isSettingsOpen = useAppSelector((state) => state.app.isSettingsOpen);

  return (
    <div
      className={clsx(
        { hidden: !isSettingsOpen },
        "absolute h-screen w-screen bg-transparentBlack z-50 flex justify-center items-center"
      )}
    >
      {props.children}
    </div>
  );
};

export default Overlay;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Overlay/index.ts
```ts
import Overlay from "./Overlay";

export default Overlay;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ProfileDropdown/ProfileDropdown.tsx
```tsx
import useClickOutside from "../../hooks/useClickOutside";

import SettingsIcon from "../../icons/setting";
import LogoutIcon from "../../icons/logout";

import { useAppDispatch } from "../../store/hooks";
import { toggleSettings } from "../../store/features/app/appSlice";

interface ProfileDropdownProps {
  hide: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (props) => {
  const dispatch = useAppDispatch();
  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[260px] right-[20px] mt-[10px]"
    >
      <div
        className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
        onClick={() => dispatch(toggleSettings())}
      >
        <div className="h-[20px] w-[20px] text-textSecondary">
          <SettingsIcon />
        </div>
        <div className="ml-[10px]">Settings</div>
      </div>
      <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center">
        <div className="h-[20px] w-[20px] text-textSecondary">
          <LogoutIcon />
        </div>
        <div className="ml-[10px]">Logout</div>
      </div>
    </div>
  );
};

export default ProfileDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ProfileDropdown/index.ts
```ts
import ProfileDropdown from "./ProfileDropdown";

export default ProfileDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/SendChatInput.tsx
```tsx
import { useState } from "react";

interface SendChatInputProps {
  type: "character" | "story" | "game";
  id?: string;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`; // Set new height
    setValue(textarea.value);
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex items-center bg-lightGray rounded-lg p-[10px]">
        <textarea
          value={value}
          onChange={handleInput}
          className="bg-transparent border-none placeholder:text-textSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message..."
          rows={1}
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/index.ts
```ts
import SendChatInput from "./SendChatInput";

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Settings/Settings.tsx
```tsx
import clsx from "clsx";
import { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import GuardIcon from "../../icons/guard";
import MembershipIcon from "../../icons/membership";
import PersonalizationIcon from "../../icons/personalization";
import { toggleSettings } from "../../store/features/app/appSlice";

const Settings: React.FC = () => {
  const isSettingsOpen = useAppSelector((state) => state.app.isSettingsOpen);
  const dispatch = useAppDispatch();
  const [selectedView, setSelectedView] = useState<
    "personalization" | "account" | "membership"
  >("personalization");
  const [showChangeMyPassword, setShowChangeMyPassword] =
    useState<boolean>(false);

  return (
    <div
      className={clsx(
        { hidden: !isSettingsOpen },
        "bg-white rounded-lg py-5 w-[680px]"
      )}
    >
      <div className="flex justify-between items-center pb-5 px-5 border-b border-borderBlack">
        <div className="text-lg font-semibold">Settings</div>
        <div
          onClick={() => dispatch(toggleSettings())}
          className="h-[18px] w-[18px] cursor-pointer"
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col p-[10px]">
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "personalization" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("personalization")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <PersonalizationIcon />
            </div>
            <div>Personalization</div>
          </div>
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "account" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("account")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <GuardIcon />
            </div>
            <div>Account</div>
          </div>
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "membership" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("membership")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <MembershipIcon />
            </div>
            <div>Membership</div>
          </div>
        </div>
        <div className="p-[20px] w-full">
          {selectedView === "account" ? (
            <>
              <div
                className={clsx(
                  { hidden: showChangeMyPassword },
                  "cursor-pointer hover:underline"
                )}
                onClick={() => setShowChangeMyPassword(true)}
              >
                Change my password
              </div>
              <div
                className={clsx(
                  { hidden: !showChangeMyPassword },
                  "flex flex-col"
                )}
              >
                <input
                  type="password"
                  placeholder="Current password"
                  className="outline-none p-[5px] mb-[10px]"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="outline-none p-[5px] mb-[10px]"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="outline-none p-[5px] mb-[10px]"
                />
                <div className="flex justify-end w-full">
                  <div
                    className="cursor-pointer mr-[20px] hover:bg-lightGray rounded-lg pl-[20px] pr-[20px] p-[5px]"
                    onClick={() => setShowChangeMyPassword(false)}
                  >
                    Change
                  </div>
                  <div
                    className="cursor-pointer mr-[10px] hover:bg-lightGray rounded-lg pl-[20px] pr-[20px] p-[5px]"
                    onClick={() => setShowChangeMyPassword(false)}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </>
          ) : selectedView === "membership" ? (
            <></>
          ) : selectedView === "personalization" ? (
            <></>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Settings/index.ts
```ts
import Settings from "./Settings";

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickAnywhere.tsx
```tsx
import { useEffect } from "react";

function useClickAnywhere(callback: (event: MouseEvent) => void): void {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      callback(event);
    };

    document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [callback]);
}

export default useClickAnywhere;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickOutside.tsx
```tsx
import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLDivElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useNewChatLocation.tsx
```tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useNewChatLocation = (): string => {
  const [newChatLocation, setNewChatLocation] = useState<string>("/story/new");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.indexOf("/character") === 0) {
      setNewChatLocation("/character/new");
    } else if (location.pathname.indexOf("/game") === 0) {
      setNewChatLocation("/game/new");
    } else if (location.pathname.indexOf("/story") === 0) {
      setNewChatLocation("/story/new");
    } else {
      setNewChatLocation("/story/new");
    }
  }, [location]);

  return newChatLocation;
};

export default useNewChatLocation;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/check.tsx
```tsx
const check: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16.0755 7.93219C16.5272 8.25003 16.6356 8.87383 16.3178 9.32549L11.5678 16.0755C11.3931 16.3237 11.1152 16.4792 10.8123 16.4981C10.5093 16.517 10.2142 16.3973 10.0101 16.1727L7.51006 13.4227C7.13855 13.014 7.16867 12.3816 7.57733 12.0101C7.98598 11.6386 8.61843 11.6687 8.98994 12.0773L10.6504 13.9039L14.6822 8.17451C15 7.72284 15.6238 7.61436 16.0755 7.93219Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default check;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/chevronDown.tsx
```tsx
const ChevronDown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default ChevronDown;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/close.tsx
```tsx
const Close: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.63603 5.63604C6.02656 5.24552 6.65972 5.24552 7.05025 5.63604L12 10.5858L16.9497 5.63604C17.3403 5.24552 17.9734 5.24552 18.364 5.63604C18.7545 6.02657 18.7545 6.65973 18.364 7.05025L13.4142 12L18.364 16.9497C18.7545 17.3403 18.7545 17.9734 18.364 18.364C17.9734 18.7545 17.3403 18.7545 16.9497 18.364L12 13.4142L7.05025 18.364C6.65972 18.7545 6.02656 18.7545 5.63603 18.364C5.24551 17.9734 5.24551 17.3403 5.63603 16.9497L10.5858 12L5.63603 7.05025C5.24551 6.65973 5.24551 6.02657 5.63603 5.63604Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Close;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/guard.tsx
```tsx
const Guard: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.4008 3.76687C12.1453 3.65508 11.8547 3.65508 11.5992 3.76687L5.59918 6.39187C5.23519 6.55112 5 6.91073 5 7.30803V13C5 14.7136 5.61571 16.2833 6.63795 17.5001C7.92137 15.9724 9.84647 15 11.9999 15C14.1534 15 16.0785 15.9724 17.3619 17.5002C18.3843 16.2834 19 14.7136 19 13V7.30803C19 6.91073 18.7648 6.55112 18.4008 6.39187L12.4008 3.76687ZM15.8701 18.8338C14.9525 17.7135 13.5589 17 11.9999 17C10.441 17 9.04741 17.7135 8.12979 18.8337C9.23837 19.5706 10.569 20 12 20C13.4309 20 14.7615 19.5707 15.8701 18.8338ZM10.7975 1.93456C11.5641 1.59919 12.4359 1.59919 13.2025 1.93456L19.2025 4.55956C20.2944 5.03729 21 6.11614 21 7.30803V13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13V7.30803C3 6.11614 3.70558 5.03729 4.79754 4.55956L10.7975 1.93456ZM12 8.5C11.0335 8.5 10.25 9.2835 10.25 10.25C10.25 11.2165 11.0335 12 12 12C12.9665 12 13.75 11.2165 13.75 10.25C13.75 9.2835 12.9665 8.5 12 8.5ZM8.25 10.25C8.25 8.17893 9.92893 6.5 12 6.5C14.0711 6.5 15.75 8.17893 15.75 10.25C15.75 12.3211 14.0711 14 12 14C9.92893 14 8.25 12.3211 8.25 10.25Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Guard;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/logout.tsx
```tsx
const Logout: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Logout;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/membership.tsx
```tsx
const Membership: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 3.21876L14.4631 4.93466C14.7001 5.09977 14.9701 5.21155 15.2542 5.26238L18.2093 5.79072L18.7376 8.74559C18.7884 9.02993 18.9003 9.30008 19.0656 9.53719L20.7813 12L19.0655 14.4629C18.9003 14.7 18.7884 14.9702 18.7376 15.2543L18.2093 18.2093L15.2545 18.7376C14.97 18.7884 14.7 18.9003 14.4631 19.0654L12 20.7813L9.53718 19.0656C9.30007 18.9003 9.03003 18.7884 8.74569 18.7376L5.79076 18.2093L5.26239 15.2543C5.21154 14.9699 5.09969 14.7 4.93466 14.4631L3.21875 12L4.93463 9.53696C5.09975 9.29994 5.21155 9.02999 5.26238 8.74572L5.79072 5.79072L8.7457 5.26239C9.02996 5.21156 9.29992 5.09977 9.53693 4.93466L12 3.21876ZM13.1432 1.57771C12.4562 1.0991 11.5438 1.0991 10.8568 1.57771L8.3937 3.29361L5.43872 3.82194C4.6145 3.9693 3.9693 4.6145 3.82194 5.43872L3.29361 8.39368L1.57772 10.8568C1.0991 11.5438 1.09909 12.4562 1.5777 13.1432L3.29359 15.6063L3.82194 18.5613C3.9693 19.3855 4.61449 20.0307 5.43867 20.1781L8.39364 20.7064L10.8568 22.4223C11.5438 22.9009 12.4562 22.9009 13.1432 22.4223L15.6063 20.7064L18.5613 20.1781C19.3855 20.0307 20.0307 19.3855 20.1781 18.5614L20.7064 15.6064L22.4223 13.1432C22.9009 12.4562 22.9009 11.5438 22.4223 10.8568L20.7064 8.39371L20.1781 5.43873C20.0307 4.61455 19.3855 3.96931 18.5613 3.82194L15.6064 3.29363L13.1432 1.57771Z"
      fill="currentColor"
    ></path>
    <path
      d="M11.5876 8.1018C11.7862 7.81202 12.2138 7.81202 12.4124 8.1018L13.4865 9.669C13.5515 9.76387 13.6473 9.83342 13.7576 9.86594L15.58 10.4031C15.9169 10.5025 16.0491 10.9092 15.8349 11.1876L14.6763 12.6934C14.6061 12.7846 14.5696 12.8971 14.5727 13.0121L14.625 14.9113C14.6346 15.2625 14.2886 15.5138 13.9576 15.3961L12.1675 14.7596C12.0592 14.721 11.9408 14.721 11.8325 14.7596L10.0424 15.3961C9.71136 15.5138 9.36537 15.2625 9.37502 14.9113L9.42727 13.0121C9.43043 12.8971 9.39386 12.7846 9.32372 12.6934L8.16515 11.1876C7.95091 10.9092 8.08307 10.5025 8.42003 10.4031L10.2424 9.86594C10.3527 9.83342 10.4485 9.76387 10.5135 9.669L11.5876 8.1018Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Membership;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/newChat.tsx
```tsx
const NewChat: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default NewChat;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/panel.tsx
```tsx
const Panel: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Panel;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/personalization.tsx
```tsx
const Personalization: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4ZM7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7ZM19.0277 15.6255C18.6859 15.5646 18.1941 15.6534 17.682 16.1829C17.4936 16.3777 17.2342 16.4877 16.9632 16.4877C16.6922 16.4877 16.4328 16.3777 16.2444 16.1829C15.7322 15.6534 15.2405 15.5646 14.8987 15.6255C14.5381 15.6897 14.2179 15.9384 14.0623 16.3275C13.8048 16.9713 13.9014 18.662 16.9632 20.4617C20.0249 18.662 20.1216 16.9713 19.864 16.3275C19.7084 15.9384 19.3882 15.6897 19.0277 15.6255ZM21.721 15.5847C22.5748 17.7191 21.2654 20.429 17.437 22.4892C17.1412 22.6484 16.7852 22.6484 16.4893 22.4892C12.6609 20.4291 11.3516 17.7191 12.2053 15.5847C12.6117 14.5689 13.4917 13.8446 14.5481 13.6565C15.3567 13.5125 16.2032 13.6915 16.9632 14.1924C17.7232 13.6915 18.5697 13.5125 19.3783 13.6565C20.4347 13.8446 21.3147 14.5689 21.721 15.5847ZM9.92597 14.2049C10.1345 14.7163 9.889 15.2999 9.3776 15.5084C7.06131 16.453 5.5 18.5813 5.5 20.9999C5.5 21.5522 5.05228 21.9999 4.5 21.9999C3.94772 21.9999 3.5 21.5522 3.5 20.9999C3.5 17.6777 5.641 14.8723 8.6224 13.6565C9.1338 13.448 9.71743 13.6935 9.92597 14.2049Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Personalization;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/plus.tsx
```tsx
const Plus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Plus;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/refresh.tsx
```tsx
const Refresh: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.47189 2.5C5.02418 2.5 5.47189 2.94772 5.47189 3.5V5.07196C7.17062 3.47759 9.45672 2.5 11.9719 2.5C17.2186 2.5 21.4719 6.75329 21.4719 12C21.4719 17.2467 17.2186 21.5 11.9719 21.5C7.10259 21.5 3.09017 17.8375 2.53689 13.1164C2.47261 12.5679 2.86517 12.0711 3.4137 12.0068C3.96223 11.9425 4.45901 12.3351 4.5233 12.8836C4.95988 16.6089 8.12898 19.5 11.9719 19.5C16.114 19.5 19.4719 16.1421 19.4719 12C19.4719 7.85786 16.114 4.5 11.9719 4.5C9.7515 4.5 7.75549 5.46469 6.38143 7H9C9.55228 7 10 7.44772 10 8C10 8.55228 9.55228 9 9 9H4.47189C3.93253 9 3.4929 8.57299 3.47262 8.03859C3.47172 8.01771 3.47147 7.99677 3.47189 7.9758V3.5C3.47189 2.94772 3.91961 2.5 4.47189 2.5Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Refresh;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/send.tsx
```tsx
const Send: React.FC = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Send;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/setting.tsx
```tsx
const Settings: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.5677 3.5C11.2129 3.5 10.8847 3.68789 10.7051 3.99377L9.89391 5.37524C9.3595 6.28538 8.38603 6.84786 7.3304 6.85645L5.73417 6.86945C5.3794 6.87233 5.0527 7.06288 4.87559 7.3702L4.43693 8.13135C4.2603 8.43784 4.25877 8.81481 4.43291 9.12273L5.22512 10.5235C5.74326 11.4397 5.74326 12.5603 5.22512 13.4765L4.43291 14.8773C4.25877 15.1852 4.2603 15.5622 4.43693 15.8687L4.87559 16.6298C5.0527 16.9371 5.3794 17.1277 5.73417 17.1306L7.33042 17.1436C8.38605 17.1522 9.35952 17.7146 9.89393 18.6248L10.7051 20.0062C10.8847 20.3121 11.2129 20.5 11.5677 20.5H12.4378C12.7926 20.5 13.1208 20.3121 13.3004 20.0062L14.1116 18.6248C14.646 17.7146 15.6195 17.1522 16.6751 17.1436L18.2714 17.1306C18.6262 17.1277 18.9529 16.9371 19.13 16.6298L19.5687 15.8687C19.7453 15.5622 19.7468 15.1852 19.5727 14.8773L18.7805 13.4765C18.2623 12.5603 18.2623 11.4397 18.7805 10.5235L19.5727 9.12273C19.7468 8.81481 19.7453 8.43784 19.5687 8.13135L19.13 7.3702C18.9529 7.06288 18.6262 6.87233 18.2714 6.86945L16.6751 6.85645C15.6195 6.84786 14.646 6.28538 14.1116 5.37524L13.3004 3.99377C13.1208 3.68788 12.7926 3.5 12.4378 3.5H11.5677ZM8.97978 2.98131C9.5186 2.06365 10.5033 1.5 11.5677 1.5H12.4378C13.5022 1.5 14.4869 2.06365 15.0257 2.98131L15.8369 4.36278C16.015 4.66616 16.3395 4.85365 16.6914 4.85652L18.2877 4.86951C19.352 4.87818 20.3321 5.4498 20.8635 6.37177L21.3021 7.13292C21.832 8.05239 21.8366 9.18331 21.3142 10.1071L20.522 11.5078C20.3493 11.8132 20.3493 12.1868 20.522 12.4922L21.3142 13.893C21.8366 14.8167 21.832 15.9476 21.3021 16.8671L20.8635 17.6282C20.3321 18.5502 19.352 19.1218 18.2877 19.1305L16.6914 19.1435C16.3395 19.1464 16.015 19.3339 15.8369 19.6372L15.0257 21.0187C14.4869 21.9363 13.5022 22.5 12.4378 22.5H11.5677C10.5033 22.5 9.5186 21.9363 8.97978 21.0187L8.16863 19.6372C7.99049 19.3339 7.666 19.1464 7.31413 19.1435L5.71789 19.1305C4.65357 19.1218 3.67347 18.5502 3.14213 17.6282L2.70347 16.8671C2.17358 15.9476 2.16899 14.8167 2.6914 13.893L3.48361 12.4922C3.65632 12.1868 3.65632 11.8132 3.48361 11.5078L2.6914 10.1071C2.16899 9.18331 2.17358 8.05239 2.70347 7.13292L3.14213 6.37177C3.67347 5.4498 4.65357 4.87818 5.71789 4.86951L7.31411 4.85652C7.66599 4.85366 7.99048 4.66616 8.16862 4.36278L8.97978 2.98131Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0028 10.5C11.1741 10.5 10.5024 11.1716 10.5024 12C10.5024 12.8284 11.1741 13.5 12.0028 13.5C12.8315 13.5 13.5032 12.8284 13.5032 12C13.5032 11.1716 12.8315 10.5 12.0028 10.5ZM8.50178 12C8.50178 10.067 10.0692 8.5 12.0028 8.5C13.9364 8.5 15.5038 10.067 15.5038 12C15.5038 13.933 13.9364 15.5 12.0028 15.5C10.0692 15.5 8.50178 13.933 8.50178 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/share.tsx
```tsx
const Share: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.2929 3.29289C11.6834 2.90237 12.3166 2.90237 12.7071 3.29289L16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711C16.3166 9.09763 15.6834 9.09763 15.2929 8.70711L13 6.41421V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V6.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L11.2929 3.29289ZM4 14C4.55228 14 5 14.4477 5 15V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V15C3 14.4477 3.44772 14 4 14Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Share;

```

path: /Users/dannybengal/dev/lola/webapp/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

h1 {
  font-size: xx-large;
}

h2 {
  font-size: x-large;
}

h3 {
  font-size: large;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

path: /Users/dannybengal/dev/lola/webapp/src/logo.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>
```

path: /Users/dannybengal/dev/lola/webapp/src/output.md
```md
path: /Users/dannybengal/dev/lola/webapp/src/App.test.tsx
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

path: /Users/dannybengal/dev/lola/webapp/src/App.tsx
```tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Overlay from "./components/Overlay";
import Settings from "./components/Settings";

import CharacterPage from "./pages/Character";
import GamePage from "./pages/Game";
import StoryPage from "./pages/Story";
import NewStoryPage from "./pages/NewStory";
import NewGamePage from "./pages/NewGame";

import { store } from "./store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Overlay>
          <Settings />
        </Overlay>
        <div className="app text-textPrimary flex flex-row">
          <LeftPanel />
          <div className="flex flex-col h-screen overflow-y-scroll w-full z-10 bg-white">
            <div className="flex flex-col grow overflow-y-scroll">
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/character/main" replace />}
                />
                <Route
                  path="/character/main"
                  element={<CharacterPage selected={{ type: "main" }} />}
                />
                <Route
                  path="/character/:characterId"
                  element={<CharacterPage />}
                />
                <Route path="/game" element={<GamePage />} />
                <Route path="/game/new" element={<NewGamePage />} />
                <Route path="/story/:storyId" element={<StoryPage />} />
                <Route path="/story/new" element={<NewStoryPage />} />
              </Routes>
            </div>
            <div className="flex w-full">
              <Footer />
            </div>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/Chat.tsx
```tsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

import imageLola from "../../lola.jpeg";
import imageDani from "../../dani.webp";
import clsx from "clsx";

interface ChatProps {
  type: "character" | "story";
  id?: string;
}

const newCharacterChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    character: "dani",
  },
];

const characterChat = [
  {
    content:
      "She sat alone in her dimly lit apartment, the hum of the city outside barely audible over the storm of thoughts in her mind. What happened to me? she wondered, her fingers tracing the edge of her coffee mug. Just days ago, she had been lost in the monotony of her routine, her creativity strangled by self-doubt. And then, she had stumbled into Muse. That gallery, that man—Andre. His words still lingered in her mind, wrapping around her like a taut thread she couldn’t untangle. He saw something in me, she thought, her cheeks warming at the memory of his gaze, steady and piercing. She had painted that night, not just with her hands but with her heart, spilling emotions she didn’t even know she’d buried. It had been terrifying, raw, and somehow freeing. But what now? she questioned, staring at the blank canvas she had brought home. The ache in her chest whispered that this was only the beginning.",
    character: "cara",
  },
  {
    content: "You should buy some new lingerie.",
    character: "user",
  },
  {
    content:
      "As she glanced at her reflection in the mirror, a playful smirk tugged at her lips. You know what? I’m going to buy myself some new lingerie—something bold, something that feels as daring as I want to be.",
    character: "cara",
  },
];

const story = [
  {
    content:
      "The city hummed with a subtle vibrancy as Cara walked briskly through the rain-slicked streets, her canvas bag slung over one shoulder. She had spent the last two days aimlessly sketching at a café, frustrated by her inability to channel her usual inspiration. The world around her felt dim, her creativity dulled by the weight of routine and self-doubt.",
    character: "narrator",
  },
  {
    content:
      "She paused under the awning of a gallery she’d never noticed before. The name 'Muse' was etched elegantly in black script across frosted glass doors. A faint pulse of bass came from within, an almost magnetic rhythm that drew her closer. It felt out of place, this unassuming storefront hiding something far more alive within its depths. Curiosity prickled at her, and before she could overthink, she stepped inside.",
    character: "narrator",
  },
  {
    content:
      "The scent of sandalwood and faint vanilla hit her first, rich and intoxicating. The lighting was low, accented by soft candles that danced against the dark, earthy walls. A few scattered patrons sipped wine, murmuring softly as they gazed at abstract art pieces that felt more visceral than intellectual. A striking figure leaned casually against a far wall, their dark eyes gleaming in the flickering light.",
    character: "narrator",
  },
  {
    content: "“Looking for something… or someone?”",
    character: "andre",
  },
  {
    content:
      "“I—just wandered in,” she admitted, suddenly aware of her soaked jacket and the slight flush on her cheeks.",
    character: "cara",
  },
  {
    content:
      "“Then you’re exactly where you’re supposed to be.” The stranger stepped closer, offering a sly smile. “I’m Andre.”",
    character: "andre",
  },
  {
    content:
      "“Cara,” she replied, her voice catching in her throat as his gaze traveled over her, lingering not with judgement but with curiosity, as though he could read her restlessness like an open book.",
    character: "cara",
  },
  {
    content:
      "Andre gestured toward the back of the gallery, where a velvet curtain hung partially open. “Let me show you something,” he said.",
    character: "andre",
  },
  {
    content:
      "Before she could protest, he was leading her into a room that felt entirely separate from the one they’d just left. Here, the air was heavier, thick with a tension that made her pulse quicken. The walls were lined with canvases depicting moments of intimacy so raw they felt almost intrusive. Bodies entwined in shadowy suggestion, faces caught in expressions of pure abandon.",
    character: "narrator",
  },
  {
    content:
      "“What… is this place?” she whispered, her fingers brushing lightly against the edge of a frame.",
    character: "cara",
  },
  {
    content:
      "Andre tilted his head, studying her. “It’s a sanctuary for those who seek something deeper. You see, art isn’t just about paint on a canvas. It’s about emotion, vulnerability. Submission, even.”",
    character: "andre",
  },
  {
    content:
      "The word hit her like a bolt of lightning. Submission. Her mind spiraled, unbidden images flashing of herself yielding, giving up control to someone who could see through her guarded layers.",
    character: "narrator",
  },
  {
    content:
      "“You look like someone who could use inspiration,” Andre murmured, stepping closer, his voice a low thrum against her skin. “Tell me, Cara… do you trust yourself enough to let go?”",
    character: "andre",
  },
  {
    content:
      "Her lips parted, but no words came. She felt the heat of his proximity, the intoxicating pull of his presence. He reached out, his fingertips ghosting along the edge of her jaw.",
    character: "narrator",
  },
  {
    content:
      "“I can help you find what you’re looking for,” he said, his voice soft but firm. “But only if you’re willing to surrender to the experience.”",
    character: "andre",
  },
  {
    content:
      "Her heart thundered in her chest. She didn’t know what compelled her to nod, but when she did, Andre’s lips curved into a knowing smile.",
    character: "narrator",
  },
  {
    content:
      "“Good,” he said. “Come back tomorrow night. Bring nothing but yourself. And leave the rest to me.”",
    character: "andre",
  },
  {
    content: "Make them fuck",
    character: "user",
  },
  {
    content:
      "The rain had stopped when Cara stepped out of the gallery, the cool night air brushing against her flushed cheeks. Her mind raced with questions, Andre's words echoing in her head. 'Surrender to the experience.' What did that even mean? And why had she agreed so readily?",
    character: "narrator",
  },
  {
    content:
      "The following day felt like a blur. Cara wandered aimlessly through her apartment, unable to focus on her sketches or her usual routines. She kept replaying the encounter, Andre's enigmatic smile and the intensity of his gaze.",
    character: "narrator",
  },
  {
    content:
      "That evening, Cara found herself standing outside the gallery once again. She hesitated, her fingers trembling as they gripped the strap of her bag. She had left everything else behind, just as he had instructed. But now, the weight of the unknown pressed heavily on her chest.",
    character: "narrator",
  },
  {
    content:
      "The door opened before she could make a decision. Andre stood there, dressed sharply in a tailored jacket, his expression one of quiet confidence. 'I was wondering if you'd come,' he said, stepping aside to let her in.",
    character: "andre",
  },
  {
    content:
      "Cara nodded, unable to find her voice. She stepped past him, the familiar scent of sandalwood and vanilla wrapping around her like a veil. The gallery was dimly lit, its usual patrons absent. Only the faint pulse of music remained, a haunting melody that seemed to guide her steps.",
    character: "narrator",
  },
  {
    content:
      "'Follow me,' Andre said, his tone softer now, almost reassuring. He led her past the velvet curtain once more, into the intimate room she had seen the night before. But this time, the space felt different—charged, alive.",
    character: "andre",
  },
  {
    content:
      "In the center of the room was an easel, a blank canvas waiting to be transformed. Andre gestured toward it. 'Tonight, we create together,' he said. 'No limits, no hesitation. Let your instincts guide you.'",
    character: "andre",
  },
  {
    content:
      "Cara hesitated, the weight of his words sinking in. 'I don't even know where to start,' she admitted, her voice barely above a whisper.",
    character: "cara",
  },
  {
    content:
      "'Start with yourself,' Andre replied. 'Strip away the fear, the doubt. Let the canvas see who you really are.'",
    character: "andre",
  },
  {
    content:
      "Her breath caught, the vulnerability of his request striking her deeply. Slowly, she stepped forward, her fingers trembling as they reached for the brush. Andre moved closer, his presence steady and grounding. Together, they began to paint, the strokes raw and unfiltered, their emotions bleeding onto the canvas.",
    character: "narrator",
  },
  {
    content:
      "As the night wore on, the lines between creation and connection blurred. Cara found herself letting go in ways she never imagined possible, her trust in Andre growing with every shared glance, every whispered word of encouragement.",
    character: "narrator",
  },
  {
    content:
      "When they finally stepped back to admire their work, the canvas was alive with color and texture—a reflection of everything she had been too afraid to express. Andre's hand rested lightly on her shoulder, his voice low and sincere. 'This is just the beginning,' he said.",
    character: "andre",
  },
  {
    content:
      "Cara nodded, a small smile playing on her lips. For the first time in what felt like forever, she felt truly inspired.",
    character: "narrator",
  },
  {
    content:
      "This feels like a good step forward for their connection, but maybe there’s room to push it further later? What do you think?",
    character: "user",
  },
];

const Chat: React.FC<ChatProps> = (props) => {
  const [chatLog, setChatLog] = useState(characterChat);
  const location = useLocation();

  useEffect(() => {
    props.id === "new"
      ? setChatLog(newCharacterChat)
      : props.id === "qsqf909Ddsdf-a-random-story"
      ? setChatLog(story)
      : setChatLog(characterChat);
  }, [props]);

  return (
    <div className="w-full max-w-[715px]">
      <div className="w-full flex">
        <div className="w-auto grow mb-[30px]">
          {chatLog.map((message) =>
            message.character === "user" ? (
              <div className="flex flex-row justify-end mb-[20px]">
                <div
                  className={clsx(
                    {
                      "max-w-[60%]": location.pathname.indexOf("/story") === 0,
                      "max-w-[80%]": location.pathname.indexOf("/story") !== 0,
                    },
                    "w-fit  bg-messageBackground rounded-lg p-[10px]"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-row mb-[10px]">
                <div className="w-[30px] h-[30px] mr-[10px]">
                  {message.character !== "narrator" ? (
                    <img
                      className="rounded-full h-[30px] w-[30px]"
                      src={message.character === "cara" ? imageLola : imageDani}
                    />
                  ) : null}
                </div>
                <div className="grow max-w-[calc(100%-50px)]">
                  {message.content}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/index.ts
```ts
import Chat from "./Chat";

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/Footer.tsx
```tsx
const Footer: React.FC = () => {
  return (
    <div className="w-full text-center">
      Lola is a storyteller. Everything is fictive.
    </div>
  );
};

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/index.ts
```ts
import Footer from "./Footer";

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/Header.tsx
```tsx
import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import ChevronDown from "../../icons/chevronDown";
import ModeDropdown from "../ModeDropdown";
import ProfileDropdown from "../ProfileDropdown";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";

const Header: React.FC = () => {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("Main character");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);
  const newChatLocation = useNewChatLocation();

  const toggleModeDropdown = () => {
    setModeDropdownOpen(!modeDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  useEffect(() => {
    location.pathname.indexOf("/character/main") === 0
      ? setHeaderLabel("Main character")
      : location.pathname.indexOf("/character/new") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/character") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/game/new") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/game") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/story/new") === 0
      ? setHeaderLabel("Story")
      : location.pathname.indexOf("/story") === 0
      ? setHeaderLabel("Story")
      : navigate("/character/main");
    setModeDropdownOpen(false);
  }, [location]);

  return (
    <div className="pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between">
      <div className="w-auto h-auto">
        <div className="flex flex-row items-center">
          {!isLeftPanelOpen ? (
            <div className="flex flex-row text-textSecondary">
              <div
                className="h-[24px] w-[24px] cursor-pointer mr-[10px]"
                onClick={() => dispatch(toggleLeftPanel())}
              >
                <PanelIcon />
              </div>
              <NavLink to={newChatLocation}>
                <div className="h-[24px] w-[24px]  mr-[10px]">
                  <NewChatIcon />
                </div>
              </NavLink>
            </div>
          ) : null}
          <div
            className="h-[40px] items-center flex flex-row text-textSecondary cursor-pointer"
            onClick={toggleModeDropdown}
          >
            <span className="font-bold">{headerLabel}</span>
            <div className="h-[24px] w-[24px]">
              <ChevronDown />
            </div>
          </div>
        </div>
        <div className={clsx({ hidden: !modeDropdownOpen })}>
          <ModeDropdown hide={() => setModeDropdownOpen(false)} />
        </div>
      </div>
      <div>
        <div
          className="bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer"
          onClick={toggleProfileDropdown}
        >
          D
        </div>
        <div className={clsx({ hidden: !profileDropdownOpen })}>
          <ProfileDropdown hide={() => setProfileDropdownOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/index.ts
```ts
import Header from "./Header";

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/LeftPanel.tsx
```tsx
import { NavLink } from "react-router";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import PlusIcon from "../../icons/plus";
import imageDani from "../../dani.webp";
import imageClaire from "../../lola.jpeg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import clsx from "clsx";

const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const newChatLocation = useNewChatLocation();
  const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);

  const characters = [
    {
      id: "dani01",
      label: "Dani",
      type: "main",
      image: imageDani,
    },
    {
      id: "2329890kj09-claire",
      label: "Claire",
      image: imageClaire,
    },
  ];

  const stories = [
    {
      id: "qsqf909Ddsdf-a-random-story",
      label: "A random story",
    },
  ];

  const games = [];

  return (
    <div
      className={clsx(
        {
          "w-[260px]": isLeftPanelOpen,
          "w-0": !isLeftPanelOpen,
        },
        `transition-all duration-500`
      )}
    >
      <div className="h-screen w-[260px] bg-lightGray flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary">
            <div
              className="h-[24px] w-[24px] cursor-pointer"
              onClick={() => dispatch(toggleLeftPanel())}
            >
              <PanelIcon />
            </div>
            <NavLink to={newChatLocation}>
              <div className="h-[24px] w-[24px]">
                <NewChatIcon />
              </div>
            </NavLink>
          </div>
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div>Characters</div>
            {characters.length > 0 ? (
              <NavLink to="/character/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          {characters.length == 0 ? (
            <NavLink to="/character/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New character</span>
              </div>
            </NavLink>
          ) : (
            characters.map((char) => (
              <NavLink
                to={
                  char.type === "main"
                    ? "/character/main"
                    : `/character/${char.id}`
                }
              >
                <div className="flex flex-row items-center h-[40px] hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                  <div className="h-[24px] w-[24px]">
                    <img
                      src={char.image}
                      className="rounded-full h-[24px] w-[24px]"
                    />
                  </div>
                  <span className="pl-[10px]">{char.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div className="font-bold h-[40px] content-center">Games</div>
            {games.length > 0 ? (
              <NavLink to="/game/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          <NavLink to="/game/new">
            <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
              <div className="h-[20px] w-[20px] text-textSecondary">
                <PlusIcon />
              </div>
              <span className="pl-[10px]">New game</span>
            </div>
          </NavLink>
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div className="font-bold h-[40px] content-center">Stories</div>
            {stories.length > 0 ? (
              <NavLink to="/story/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          {stories.length === 0 ? (
            <NavLink to="/story/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New story</span>
              </div>
            </NavLink>
          ) : (
            stories.map((story) => (
              <NavLink to={`/story/${story.id}`}>
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <span className="">{story.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/index.ts
```ts
import LeftPanel from "./LeftPanel";

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/ModeDropdown.tsx
```tsx
import { NavLink, useLocation } from "react-router";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";

interface ModeDropdownProps {
  hide: () => void;
}

const ModeDropdown: React.FC<ModeDropdownProps> = (props) => {
  const location = useLocation();

  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[320px]"
    >
      <NavLink
        to={
          location.pathname.indexOf("/character") == 0
            ? location.pathname
            : "/character/main"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Character</div>
            <div className="text-textSecondary text-xs">
              Take care of your characters
            </div>
          </div>
          {location.pathname.indexOf("/character") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/game") == 0 ? location.pathname : "/game"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>You are the hero</div>
            <div className="text-textSecondary text-xs">Play the game</div>
          </div>
          {location.pathname.indexOf("/game") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/story") == 0
            ? location.pathname
            : "/story/new"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Story</div>
            <div className="text-textSecondary text-xs">You are the author</div>
          </div>
          {location.pathname.indexOf("/story") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/index.ts
```ts
import ModeDropdown from "./ModeDropdown";

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Overlay/Overlay.tsx
```tsx
import clsx from "clsx";
import { useAppSelector } from "../../store/hooks";

interface OverlayProps {
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const isSettingsOpen = useAppSelector((state) => state.app.isSettingsOpen);

  return (
    <div
      className={clsx(
        { hidden: !isSettingsOpen },
        "absolute h-screen w-screen bg-transparentBlack z-50 flex justify-center items-center"
      )}
    >
      {props.children}
    </div>
  );
};

export default Overlay;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Overlay/index.ts
```ts
import Overlay from "./Overlay";

export default Overlay;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ProfileDropdown/ProfileDropdown.tsx
```tsx
import useClickOutside from "../../hooks/useClickOutside";

import SettingsIcon from "../../icons/setting";
import LogoutIcon from "../../icons/logout";

import { useAppDispatch } from "../../store/hooks";
import { toggleSettings } from "../../store/features/app/appSlice";

interface ProfileDropdownProps {
  hide: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (props) => {
  const dispatch = useAppDispatch();
  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[260px] right-[20px] mt-[10px]"
    >
      <div
        className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
        onClick={() => dispatch(toggleSettings())}
      >
        <div className="h-[20px] w-[20px] text-textSecondary">
          <SettingsIcon />
        </div>
        <div className="ml-[10px]">Settings</div>
      </div>
      <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center">
        <div className="h-[20px] w-[20px] text-textSecondary">
          <LogoutIcon />
        </div>
        <div className="ml-[10px]">Logout</div>
      </div>
    </div>
  );
};

export default ProfileDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ProfileDropdown/index.ts
```ts
import ProfileDropdown from "./ProfileDropdown";

export default ProfileDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/SendChatInput.tsx
```tsx
import { useState } from "react";

interface SendChatInputProps {
  type: "character" | "story";
  id?: string;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`; // Set new height
    setValue(textarea.value);
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex items-center bg-lightGray rounded-lg p-[10px]">
        <textarea
          value={value}
          onChange={handleInput}
          className="bg-transparent border-none placeholder:text-textSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message..."
          rows={1}
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/index.ts
```ts
import SendChatInput from "./SendChatInput";

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Settings/Settings.tsx
```tsx
import clsx from "clsx";
import { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import GuardIcon from "../../icons/guard";
import MembershipIcon from "../../icons/membership";
import PersonalizationIcon from "../../icons/personalization";
import { toggleSettings } from "../../store/features/app/appSlice";

const Settings: React.FC = () => {
  const isSettingsOpen = useAppSelector((state) => state.app.isSettingsOpen);
  const dispatch = useAppDispatch();
  const [selectedView, setSelectedView] = useState<
    "personalization" | "account" | "membership"
  >("personalization");

  return (
    <div
      className={clsx(
        { hidden: !isSettingsOpen },
        "bg-white rounded-lg py-5 w-[680px]"
      )}
    >
      <div className="flex justify-between items-center pb-5 px-5 border-b border-borderBlack">
        <div className="text-lg font-semibold">Settings</div>
        <div
          onClick={() => dispatch(toggleSettings())}
          className="h-[18px] w-[18px] cursor-pointer"
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col p-[10px]">
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "personalization" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("personalization")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <PersonalizationIcon />
            </div>
            <div>Personalization</div>
          </div>
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "account" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("account")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <GuardIcon />
            </div>
            <div>Account</div>
          </div>
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "membership" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("membership")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <MembershipIcon />
            </div>
            <div>Membership</div>
          </div>
        </div>
        <div className="">
          {selectedView === "account" ? (
            <></>
          ) : selectedView === "membership" ? (
            <></>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Settings/index.ts
```ts
import Settings from "./Settings";

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickAnywhere.tsx
```tsx
import { useEffect } from "react";

function useClickAnywhere(callback: (event: MouseEvent) => void): void {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      callback(event);
    };

    document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [callback]);
}

export default useClickAnywhere;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickOutside.tsx
```tsx
import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLDivElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useNewChatLocation.tsx
```tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useNewChatLocation = (): string => {
  const [newChatLocation, setNewChatLocation] = useState<string>("/story/new");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.indexOf("/character") === 0) {
      setNewChatLocation("/character/new");
    } else if (location.pathname.indexOf("/game") === 0) {
      setNewChatLocation("/game/new");
    } else if (location.pathname.indexOf("/story") === 0) {
      setNewChatLocation("/story/new");
    } else {
      setNewChatLocation("/story/new");
    }
  }, [location]);

  return newChatLocation;
};

export default useNewChatLocation;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/check.tsx
```tsx
const check: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16.0755 7.93219C16.5272 8.25003 16.6356 8.87383 16.3178 9.32549L11.5678 16.0755C11.3931 16.3237 11.1152 16.4792 10.8123 16.4981C10.5093 16.517 10.2142 16.3973 10.0101 16.1727L7.51006 13.4227C7.13855 13.014 7.16867 12.3816 7.57733 12.0101C7.98598 11.6386 8.61843 11.6687 8.98994 12.0773L10.6504 13.9039L14.6822 8.17451C15 7.72284 15.6238 7.61436 16.0755 7.93219Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default check;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/chevronDown.tsx
```tsx
const ChevronDown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default ChevronDown;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/close.tsx
```tsx
const Close: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.63603 5.63604C6.02656 5.24552 6.65972 5.24552 7.05025 5.63604L12 10.5858L16.9497 5.63604C17.3403 5.24552 17.9734 5.24552 18.364 5.63604C18.7545 6.02657 18.7545 6.65973 18.364 7.05025L13.4142 12L18.364 16.9497C18.7545 17.3403 18.7545 17.9734 18.364 18.364C17.9734 18.7545 17.3403 18.7545 16.9497 18.364L12 13.4142L7.05025 18.364C6.65972 18.7545 6.02656 18.7545 5.63603 18.364C5.24551 17.9734 5.24551 17.3403 5.63603 16.9497L10.5858 12L5.63603 7.05025C5.24551 6.65973 5.24551 6.02657 5.63603 5.63604Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Close;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/guard.tsx
```tsx
const Guard: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.4008 3.76687C12.1453 3.65508 11.8547 3.65508 11.5992 3.76687L5.59918 6.39187C5.23519 6.55112 5 6.91073 5 7.30803V13C5 14.7136 5.61571 16.2833 6.63795 17.5001C7.92137 15.9724 9.84647 15 11.9999 15C14.1534 15 16.0785 15.9724 17.3619 17.5002C18.3843 16.2834 19 14.7136 19 13V7.30803C19 6.91073 18.7648 6.55112 18.4008 6.39187L12.4008 3.76687ZM15.8701 18.8338C14.9525 17.7135 13.5589 17 11.9999 17C10.441 17 9.04741 17.7135 8.12979 18.8337C9.23837 19.5706 10.569 20 12 20C13.4309 20 14.7615 19.5707 15.8701 18.8338ZM10.7975 1.93456C11.5641 1.59919 12.4359 1.59919 13.2025 1.93456L19.2025 4.55956C20.2944 5.03729 21 6.11614 21 7.30803V13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13V7.30803C3 6.11614 3.70558 5.03729 4.79754 4.55956L10.7975 1.93456ZM12 8.5C11.0335 8.5 10.25 9.2835 10.25 10.25C10.25 11.2165 11.0335 12 12 12C12.9665 12 13.75 11.2165 13.75 10.25C13.75 9.2835 12.9665 8.5 12 8.5ZM8.25 10.25C8.25 8.17893 9.92893 6.5 12 6.5C14.0711 6.5 15.75 8.17893 15.75 10.25C15.75 12.3211 14.0711 14 12 14C9.92893 14 8.25 12.3211 8.25 10.25Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Guard;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/logout.tsx
```tsx
const Logout: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Logout;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/membership.tsx
```tsx
const Membership: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 3.21876L14.4631 4.93466C14.7001 5.09977 14.9701 5.21155 15.2542 5.26238L18.2093 5.79072L18.7376 8.74559C18.7884 9.02993 18.9003 9.30008 19.0656 9.53719L20.7813 12L19.0655 14.4629C18.9003 14.7 18.7884 14.9702 18.7376 15.2543L18.2093 18.2093L15.2545 18.7376C14.97 18.7884 14.7 18.9003 14.4631 19.0654L12 20.7813L9.53718 19.0656C9.30007 18.9003 9.03003 18.7884 8.74569 18.7376L5.79076 18.2093L5.26239 15.2543C5.21154 14.9699 5.09969 14.7 4.93466 14.4631L3.21875 12L4.93463 9.53696C5.09975 9.29994 5.21155 9.02999 5.26238 8.74572L5.79072 5.79072L8.7457 5.26239C9.02996 5.21156 9.29992 5.09977 9.53693 4.93466L12 3.21876ZM13.1432 1.57771C12.4562 1.0991 11.5438 1.0991 10.8568 1.57771L8.3937 3.29361L5.43872 3.82194C4.6145 3.9693 3.9693 4.6145 3.82194 5.43872L3.29361 8.39368L1.57772 10.8568C1.0991 11.5438 1.09909 12.4562 1.5777 13.1432L3.29359 15.6063L3.82194 18.5613C3.9693 19.3855 4.61449 20.0307 5.43867 20.1781L8.39364 20.7064L10.8568 22.4223C11.5438 22.9009 12.4562 22.9009 13.1432 22.4223L15.6063 20.7064L18.5613 20.1781C19.3855 20.0307 20.0307 19.3855 20.1781 18.5614L20.7064 15.6064L22.4223 13.1432C22.9009 12.4562 22.9009 11.5438 22.4223 10.8568L20.7064 8.39371L20.1781 5.43873C20.0307 4.61455 19.3855 3.96931 18.5613 3.82194L15.6064 3.29363L13.1432 1.57771Z"
      fill="currentColor"
    ></path>
    <path
      d="M11.5876 8.1018C11.7862 7.81202 12.2138 7.81202 12.4124 8.1018L13.4865 9.669C13.5515 9.76387 13.6473 9.83342 13.7576 9.86594L15.58 10.4031C15.9169 10.5025 16.0491 10.9092 15.8349 11.1876L14.6763 12.6934C14.6061 12.7846 14.5696 12.8971 14.5727 13.0121L14.625 14.9113C14.6346 15.2625 14.2886 15.5138 13.9576 15.3961L12.1675 14.7596C12.0592 14.721 11.9408 14.721 11.8325 14.7596L10.0424 15.3961C9.71136 15.5138 9.36537 15.2625 9.37502 14.9113L9.42727 13.0121C9.43043 12.8971 9.39386 12.7846 9.32372 12.6934L8.16515 11.1876C7.95091 10.9092 8.08307 10.5025 8.42003 10.4031L10.2424 9.86594C10.3527 9.83342 10.4485 9.76387 10.5135 9.669L11.5876 8.1018Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Membership;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/newChat.tsx
```tsx
const NewChat: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default NewChat;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/panel.tsx
```tsx
const Panel: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Panel;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/personalization.tsx
```tsx
const Personalization: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4ZM7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7ZM19.0277 15.6255C18.6859 15.5646 18.1941 15.6534 17.682 16.1829C17.4936 16.3777 17.2342 16.4877 16.9632 16.4877C16.6922 16.4877 16.4328 16.3777 16.2444 16.1829C15.7322 15.6534 15.2405 15.5646 14.8987 15.6255C14.5381 15.6897 14.2179 15.9384 14.0623 16.3275C13.8048 16.9713 13.9014 18.662 16.9632 20.4617C20.0249 18.662 20.1216 16.9713 19.864 16.3275C19.7084 15.9384 19.3882 15.6897 19.0277 15.6255ZM21.721 15.5847C22.5748 17.7191 21.2654 20.429 17.437 22.4892C17.1412 22.6484 16.7852 22.6484 16.4893 22.4892C12.6609 20.4291 11.3516 17.7191 12.2053 15.5847C12.6117 14.5689 13.4917 13.8446 14.5481 13.6565C15.3567 13.5125 16.2032 13.6915 16.9632 14.1924C17.7232 13.6915 18.5697 13.5125 19.3783 13.6565C20.4347 13.8446 21.3147 14.5689 21.721 15.5847ZM9.92597 14.2049C10.1345 14.7163 9.889 15.2999 9.3776 15.5084C7.06131 16.453 5.5 18.5813 5.5 20.9999C5.5 21.5522 5.05228 21.9999 4.5 21.9999C3.94772 21.9999 3.5 21.5522 3.5 20.9999C3.5 17.6777 5.641 14.8723 8.6224 13.6565C9.1338 13.448 9.71743 13.6935 9.92597 14.2049Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Personalization;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/plus.tsx
```tsx
const Plus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Plus;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/setting.tsx
```tsx
const Settings: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.5677 3.5C11.2129 3.5 10.8847 3.68789 10.7051 3.99377L9.89391 5.37524C9.3595 6.28538 8.38603 6.84786 7.3304 6.85645L5.73417 6.86945C5.3794 6.87233 5.0527 7.06288 4.87559 7.3702L4.43693 8.13135C4.2603 8.43784 4.25877 8.81481 4.43291 9.12273L5.22512 10.5235C5.74326 11.4397 5.74326 12.5603 5.22512 13.4765L4.43291 14.8773C4.25877 15.1852 4.2603 15.5622 4.43693 15.8687L4.87559 16.6298C5.0527 16.9371 5.3794 17.1277 5.73417 17.1306L7.33042 17.1436C8.38605 17.1522 9.35952 17.7146 9.89393 18.6248L10.7051 20.0062C10.8847 20.3121 11.2129 20.5 11.5677 20.5H12.4378C12.7926 20.5 13.1208 20.3121 13.3004 20.0062L14.1116 18.6248C14.646 17.7146 15.6195 17.1522 16.6751 17.1436L18.2714 17.1306C18.6262 17.1277 18.9529 16.9371 19.13 16.6298L19.5687 15.8687C19.7453 15.5622 19.7468 15.1852 19.5727 14.8773L18.7805 13.4765C18.2623 12.5603 18.2623 11.4397 18.7805 10.5235L19.5727 9.12273C19.7468 8.81481 19.7453 8.43784 19.5687 8.13135L19.13 7.3702C18.9529 7.06288 18.6262 6.87233 18.2714 6.86945L16.6751 6.85645C15.6195 6.84786 14.646 6.28538 14.1116 5.37524L13.3004 3.99377C13.1208 3.68788 12.7926 3.5 12.4378 3.5H11.5677ZM8.97978 2.98131C9.5186 2.06365 10.5033 1.5 11.5677 1.5H12.4378C13.5022 1.5 14.4869 2.06365 15.0257 2.98131L15.8369 4.36278C16.015 4.66616 16.3395 4.85365 16.6914 4.85652L18.2877 4.86951C19.352 4.87818 20.3321 5.4498 20.8635 6.37177L21.3021 7.13292C21.832 8.05239 21.8366 9.18331 21.3142 10.1071L20.522 11.5078C20.3493 11.8132 20.3493 12.1868 20.522 12.4922L21.3142 13.893C21.8366 14.8167 21.832 15.9476 21.3021 16.8671L20.8635 17.6282C20.3321 18.5502 19.352 19.1218 18.2877 19.1305L16.6914 19.1435C16.3395 19.1464 16.015 19.3339 15.8369 19.6372L15.0257 21.0187C14.4869 21.9363 13.5022 22.5 12.4378 22.5H11.5677C10.5033 22.5 9.5186 21.9363 8.97978 21.0187L8.16863 19.6372C7.99049 19.3339 7.666 19.1464 7.31413 19.1435L5.71789 19.1305C4.65357 19.1218 3.67347 18.5502 3.14213 17.6282L2.70347 16.8671C2.17358 15.9476 2.16899 14.8167 2.6914 13.893L3.48361 12.4922C3.65632 12.1868 3.65632 11.8132 3.48361 11.5078L2.6914 10.1071C2.16899 9.18331 2.17358 8.05239 2.70347 7.13292L3.14213 6.37177C3.67347 5.4498 4.65357 4.87818 5.71789 4.86951L7.31411 4.85652C7.66599 4.85366 7.99048 4.66616 8.16862 4.36278L8.97978 2.98131Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0028 10.5C11.1741 10.5 10.5024 11.1716 10.5024 12C10.5024 12.8284 11.1741 13.5 12.0028 13.5C12.8315 13.5 13.5032 12.8284 13.5032 12C13.5032 11.1716 12.8315 10.5 12.0028 10.5ZM8.50178 12C8.50178 10.067 10.0692 8.5 12.0028 8.5C13.9364 8.5 15.5038 10.067 15.5038 12C15.5038 13.933 13.9364 15.5 12.0028 15.5C10.0692 15.5 8.50178 13.933 8.50178 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

h1 {
  font-size: xx-large;
}

h2 {
  font-size: x-large;
}

h3 {
  font-size: large;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

path: /Users/dannybengal/dev/lola/webapp/src/logo.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>
```

path: /Users/dannybengal/dev/lola/webapp/src/output.md
```md
path: /Users/dannybengal/dev/lola/webapp/src/App.test.tsx
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

path: /Users/dannybengal/dev/lola/webapp/src/App.tsx
```tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";

import CharacterPage from "./pages/Character";
import GamePage from "./pages/Game";
import StoryPage from "./pages/Story";
import NewStoryPage from "./pages/NewStory";
import NewGamePage from "./pages/NewGame";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app text-textPrimary flex flex-row">
        <div className="min-w-[260px]">
          <LeftPanel />
        </div>
        <div className="flex flex-col h-screen overflow-y-scroll w-full">
          <div className="flex flex-col grow">
            <Header />
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/character/main" replace />}
              />
              <Route
                path="/character/main"
                element={<CharacterPage selected={{ type: "main" }} />}
              />
              <Route
                path="/character/:characterId"
                element={<CharacterPage />}
              />
              <Route path="/game" element={<GamePage />} />
              <Route path="/game/new" element={<NewGamePage />} />
              <Route path="/story/:storyId" element={<StoryPage />} />
              <Route path="/story/new" element={<NewStoryPage />} />
            </Routes>
          </div>
          <div className="flex w-full">
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/Chat.tsx
```tsx
interface ChatProps {
  type: "character" | "story";
  id?: string;
}

const Chat: React.FC<ChatProps> = (props) => {
  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-auto grow ">
          {props.id === "new"
            ? "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?"
            : "Carla came by this week, and as always, her visit left a pleasant, almost soothing impression, though it also awakened that part of me that constantly questions everything. 💭 Her words, her gestures, her gaze—everything about her seems deliberate, as if she knows the effect she has. 😌 It made me want to change something, a small detail to mark a subtle transformation. So, I treated myself to a pair of Ray-Bans, a choice both classic and bold, almost like a nod to another era. 😎 But deep down, do such small decisions really suffice to fill this void or give new meaning to what I’m trying to express? 🤔"}
        </div>
      </div>
    </div>
  );
};

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/index.ts
```ts
import Chat from "./Chat";

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/Footer.tsx
```tsx
const Footer: React.FC = () => {
  return (
    <div className="w-full text-center">
      Lola is a storyteller. Everything is fictive.
    </div>
  );
};

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/index.ts
```ts
import Footer from "./Footer";

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/Header.tsx
```tsx
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import ChevronDown from "../../icons/chevronDown";
import ModeDropdown from "../ModeDropdown";
import ProfileDropdown from "../ProfileDropdown";

const Header: React.FC = () => {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("Main character");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleModeDropdown = () => {
    setModeDropdownOpen(!modeDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  useEffect(() => {
    location.pathname.indexOf("/character/main") === 0
      ? setHeaderLabel("Main character")
      : location.pathname.indexOf("/character/new") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/character") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/game/new") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/game") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/story/new") === 0
      ? setHeaderLabel("Story")
      : location.pathname.indexOf("/story") === 0
      ? setHeaderLabel("Story")
      : navigate("/character/main");
    setModeDropdownOpen(false);
  }, [location]);

  return (
    <div className="pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between">
      <div className="w-auto h-auto">
        <div
          className="h-[40px] items-center flex flex-row text-textSecondary cursor-pointer"
          onClick={toggleModeDropdown}
        >
          <span className="font-bold">{headerLabel}</span>
          <div className="h-[24px] w-[24px]">
            <ChevronDown />
          </div>
        </div>
        <div className={clsx({ hidden: !modeDropdownOpen })}>
          <ModeDropdown hide={() => setModeDropdownOpen(false)} />
        </div>
      </div>
      <div>
        <div
          className="bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer"
          onClick={toggleProfileDropdown}
        >
          D
        </div>
        <div className={clsx({ hidden: !profileDropdownOpen })}>
          <ProfileDropdown hide={() => setProfileDropdownOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/index.ts
```ts
import Header from "./Header";

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/LeftPanel.tsx
```tsx
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import PlusIcon from "../../icons/plus";
import imageDani from "../../dani.webp";
import imageClaire from "../../lola.jpeg";

const LeftPanel: React.FC = () => {
  const [newChatLocation, setNewChatLocation] = useState<string>("/story/new");
  const location = useLocation();

  useEffect(() => {
    location.pathname.includes("character")
      ? setNewChatLocation("/character/new")
      : location.pathname.includes("game")
      ? setNewChatLocation("/game/new")
      : location.pathname.includes("story")
      ? setNewChatLocation("/story/new")
      : setNewChatLocation("/story/new");
  }, [location]);

  const characters = [
    {
      id: "dani01",
      label: "Dani",
      type: "main",
      image: imageDani,
    },
    {
      id: "2329890kj09-claire",
      label: "Claire",
      image: imageClaire,
    },
  ];

  const stories = [
    {
      id: "qsqf909Ddsdf-a-random-story",
      label: "A random story",
    },
  ];

  return (
    <div className="h-screen w-[260px] bg-lightGray flex flex-col pl-[20px] pr-[20px] pt-[10px]">
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary">
          <div className="h-[24px] w-[24px]">
            <PanelIcon />
          </div>
          <NavLink to={newChatLocation}>
            <div className="h-[24px] w-[24px]">
              <NewChatIcon />
            </div>
          </NavLink>
        </div>
      </div>
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
          <div>Characters</div>
          {characters.length > 0 ? (
            <NavLink to="/character/new">
              <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                <PlusIcon />
              </div>
            </NavLink>
          ) : null}
        </div>
        {characters.length == 0 ? (
          <NavLink to="/character/new">
            <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
              <div className="h-[20px] w-[20px] text-textSecondary">
                <PlusIcon />
              </div>
              <span className="pl-[10px]">New character</span>
            </div>
          </NavLink>
        ) : (
          characters.map((char) => (
            <NavLink
              to={
                char.type === "main"
                  ? "/character/main"
                  : `/character/${char.id}`
              }
            >
              <div className="flex flex-row items-center h-[40px] hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                <div className="h-[24px] w-[24px]">
                  <img
                    src={char.image}
                    className="rounded-full h-[24px] w-[24px]"
                  />
                </div>
                <span className="pl-[10px]">{char.label}</span>
              </div>
            </NavLink>
          ))
        )}
      </div>
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] content-center">Games</div>
        <NavLink to="/game/new">
          <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
            <div className="h-[20px] w-[20px] text-textSecondary">
              <PlusIcon />
            </div>
            <span className="pl-[10px]">New game</span>
          </div>
        </NavLink>
      </div>
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] content-center">Stories</div>
        {stories.length === 0 ? (
          <NavLink to="/story/new">
            <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
              <div className="h-[20px] w-[20px] text-textSecondary">
                <PlusIcon />
              </div>
              <span className="pl-[10px]">New story</span>
            </div>
          </NavLink>
        ) : (
          stories.map((story) => (
            <NavLink to={`/story/${story.id}`}>
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <span className="">{story.label}</span>
              </div>
            </NavLink>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/index.ts
```ts
import LeftPanel from "./LeftPanel";

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/ModeDropdown.tsx
```tsx
import { NavLink, useLocation } from "react-router";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";

interface ModeDropdownProps {
  hide: () => void;
}

const ModeDropdown: React.FC<ModeDropdownProps> = (props) => {
  const location = useLocation();

  useClickOutside(() => {
    console.log("clicked outside");
    props.hide();
  });

  return (
    <div className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[320px]">
      <NavLink
        to={
          location.pathname.indexOf("/character") == 0
            ? location.pathname
            : "/character/main"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Character</div>
            <div className="text-textSecondary text-xs">
              Take care of your characters
            </div>
          </div>
          {location.pathname.indexOf("/character") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/game") == 0 ? location.pathname : "/game"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>You are the hero</div>
            <div className="text-textSecondary text-xs">Play the game</div>
          </div>
          {location.pathname.indexOf("/game") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/story") == 0
            ? location.pathname
            : "/story/new"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Story</div>
            <div className="text-textSecondary text-xs">You are the author</div>
          </div>
          {location.pathname.indexOf("/story") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/index.ts
```ts
import ModeDropdown from "./ModeDropdown";

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ProfileDropdown/ProfileDropdown.tsx
```tsx
import useClickOutside from "../../hooks/useClickOutside";

import SettingsIcon from "../../icons/setting";
import LogoutIcon from "../../icons/logout";

interface ProfileDropdownProps {
  hide: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (props) => {
  useClickOutside(() => {
    props.hide();
  });

  return (
    <div className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[260px] right-[20px] mt-[10px]">
      <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center">
        <div className="h-[20px] w-[20px] text-textSecondary">
          <SettingsIcon />
        </div>
        <div className="ml-[10px]">Settings</div>
      </div>
      <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center">
        <div className="h-[20px] w-[20px] text-textSecondary">
          <LogoutIcon />
        </div>
        <div className="ml-[10px]">Logout</div>
      </div>
    </div>
  );
};

export default ProfileDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ProfileDropdown/index.ts
```ts
import ProfileDropdown from "./ProfileDropdown";

export default ProfileDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/SendChatInput.tsx
```tsx
import { useState } from "react";

interface SendChatInputProps {
  type: "character" | "story";
  id?: string;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`; // Set new height
    setValue(textarea.value);
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full h-fit flex items-center bg-lightGray rounded-lg p-[10px]">
        <textarea
          value={value}
          onChange={handleInput}
          className="bg-transparent border-none placeholder:text-textSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message..."
          rows={1} // Sets initial rows
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/index.ts
```ts
import SendChatInput from "./SendChatInput";

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickAnywhere.tsx
```tsx
import { useEffect } from "react";

function useClickAnywhere(callback: (event: MouseEvent) => void): void {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      callback(event);
    };

    document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [callback]);
}

export default useClickAnywhere;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickOutside.tsx
```tsx
import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/check.tsx
```tsx
const check: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16.0755 7.93219C16.5272 8.25003 16.6356 8.87383 16.3178 9.32549L11.5678 16.0755C11.3931 16.3237 11.1152 16.4792 10.8123 16.4981C10.5093 16.517 10.2142 16.3973 10.0101 16.1727L7.51006 13.4227C7.13855 13.014 7.16867 12.3816 7.57733 12.0101C7.98598 11.6386 8.61843 11.6687 8.98994 12.0773L10.6504 13.9039L14.6822 8.17451C15 7.72284 15.6238 7.61436 16.0755 7.93219Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default check;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/chevronDown.tsx
```tsx
const ChevronDown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default ChevronDown;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/logout.tsx
```tsx
const Logout: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 4C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H10C10.5523 20 11 20.4477 11 21C11 21.5523 10.5523 22 10 22H6C4.34315 22 3 20.6569 3 19V5C3 3.34315 4.34315 2 6 2H10C10.5523 2 11 2.44772 11 3C11 3.55228 10.5523 4 10 4H6ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Logout;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/newChat.tsx
```tsx
const NewChat: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default NewChat;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/panel.tsx
```tsx
const Panel: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Panel;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/plus.tsx
```tsx
const Plus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Plus;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/setting.tsx
```tsx
const Settings: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.5677 3.5C11.2129 3.5 10.8847 3.68789 10.7051 3.99377L9.89391 5.37524C9.3595 6.28538 8.38603 6.84786 7.3304 6.85645L5.73417 6.86945C5.3794 6.87233 5.0527 7.06288 4.87559 7.3702L4.43693 8.13135C4.2603 8.43784 4.25877 8.81481 4.43291 9.12273L5.22512 10.5235C5.74326 11.4397 5.74326 12.5603 5.22512 13.4765L4.43291 14.8773C4.25877 15.1852 4.2603 15.5622 4.43693 15.8687L4.87559 16.6298C5.0527 16.9371 5.3794 17.1277 5.73417 17.1306L7.33042 17.1436C8.38605 17.1522 9.35952 17.7146 9.89393 18.6248L10.7051 20.0062C10.8847 20.3121 11.2129 20.5 11.5677 20.5H12.4378C12.7926 20.5 13.1208 20.3121 13.3004 20.0062L14.1116 18.6248C14.646 17.7146 15.6195 17.1522 16.6751 17.1436L18.2714 17.1306C18.6262 17.1277 18.9529 16.9371 19.13 16.6298L19.5687 15.8687C19.7453 15.5622 19.7468 15.1852 19.5727 14.8773L18.7805 13.4765C18.2623 12.5603 18.2623 11.4397 18.7805 10.5235L19.5727 9.12273C19.7468 8.81481 19.7453 8.43784 19.5687 8.13135L19.13 7.3702C18.9529 7.06288 18.6262 6.87233 18.2714 6.86945L16.6751 6.85645C15.6195 6.84786 14.646 6.28538 14.1116 5.37524L13.3004 3.99377C13.1208 3.68788 12.7926 3.5 12.4378 3.5H11.5677ZM8.97978 2.98131C9.5186 2.06365 10.5033 1.5 11.5677 1.5H12.4378C13.5022 1.5 14.4869 2.06365 15.0257 2.98131L15.8369 4.36278C16.015 4.66616 16.3395 4.85365 16.6914 4.85652L18.2877 4.86951C19.352 4.87818 20.3321 5.4498 20.8635 6.37177L21.3021 7.13292C21.832 8.05239 21.8366 9.18331 21.3142 10.1071L20.522 11.5078C20.3493 11.8132 20.3493 12.1868 20.522 12.4922L21.3142 13.893C21.8366 14.8167 21.832 15.9476 21.3021 16.8671L20.8635 17.6282C20.3321 18.5502 19.352 19.1218 18.2877 19.1305L16.6914 19.1435C16.3395 19.1464 16.015 19.3339 15.8369 19.6372L15.0257 21.0187C14.4869 21.9363 13.5022 22.5 12.4378 22.5H11.5677C10.5033 22.5 9.5186 21.9363 8.97978 21.0187L8.16863 19.6372C7.99049 19.3339 7.666 19.1464 7.31413 19.1435L5.71789 19.1305C4.65357 19.1218 3.67347 18.5502 3.14213 17.6282L2.70347 16.8671C2.17358 15.9476 2.16899 14.8167 2.6914 13.893L3.48361 12.4922C3.65632 12.1868 3.65632 11.8132 3.48361 11.5078L2.6914 10.1071C2.16899 9.18331 2.17358 8.05239 2.70347 7.13292L3.14213 6.37177C3.67347 5.4498 4.65357 4.87818 5.71789 4.86951L7.31411 4.85652C7.66599 4.85366 7.99048 4.66616 8.16862 4.36278L8.97978 2.98131Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0028 10.5C11.1741 10.5 10.5024 11.1716 10.5024 12C10.5024 12.8284 11.1741 13.5 12.0028 13.5C12.8315 13.5 13.5032 12.8284 13.5032 12C13.5032 11.1716 12.8315 10.5 12.0028 10.5ZM8.50178 12C8.50178 10.067 10.0692 8.5 12.0028 8.5C13.9364 8.5 15.5038 10.067 15.5038 12C15.5038 13.933 13.9364 15.5 12.0028 15.5C10.0692 15.5 8.50178 13.933 8.50178 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Settings;

```

path: /Users/dannybengal/dev/lola/webapp/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

h1 {
  font-size: xx-large;
}

h2 {
  font-size: x-large;
}

h3 {
  font-size: large;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

path: /Users/dannybengal/dev/lola/webapp/src/logo.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>
```

path: /Users/dannybengal/dev/lola/webapp/src/output.md
```md
path: /Users/dannybengal/dev/lola/webapp/src/App.test.tsx
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

path: /Users/dannybengal/dev/lola/webapp/src/App.tsx
```tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";

import CharacterPage from "./pages/Character";
import GamePage from "./pages/Game";
import StoryPage from "./pages/Story";
import NewStoryPage from "./pages/NewStory";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app text-textPrimary flex flex-row">
        <div className="min-w-[260px]">
          <LeftPanel />
        </div>
        <div className="flex flex-col h-screen overflow-y-scroll w-full">
          <div className="flex flex-col grow">
            <Header />
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/character/main" replace />}
              />
              <Route
                path="/character/main"
                element={<CharacterPage selected={{ type: "main" }} />}
              />
              <Route path="/character" element={<CharacterPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/story/new" element={<NewStoryPage />} />
            </Routes>
          </div>
          <div className="flex w-full">
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/Chat.tsx
```tsx
const Chat: React.FC = () => {
  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-auto grow ">
          Carla came by this week, and as always, her visit left a pleasant,
          almost soothing impression, though it also awakened that part of me
          that constantly questions everything. 💭 Her words, her gestures, her
          gaze—everything about her seems deliberate, as if she knows the effect
          she has. 😌 It made me want to change something, a small detail to
          mark a subtle transformation. So, I treated myself to a pair of
          Ray-Bans, a choice both classic and bold, almost like a nod to another
          era. 😎 But deep down, do such small decisions really suffice to fill
          this void or give new meaning to what I’m trying to express? 🤔{" "}
        </div>
      </div>
    </div>
  );
};

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Chat/index.ts
```ts
import Chat from "./Chat";

export default Chat;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/Footer.tsx
```tsx
const Footer: React.FC = () => {
  return (
    <div className="w-full text-center">
      Lola is a storyteller. Everything is fictive.
    </div>
  );
};

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Footer/index.ts
```ts
import Footer from "./Footer";

export default Footer;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/Header.tsx
```tsx
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import ChevronDown from "../../icons/chevronDown";
import ModeDropdown from "../ModeDropdown";

const Header: React.FC = () => {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("Main character");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleModeDropdown = () => {
    setModeDropdownOpen(!modeDropdownOpen);
  };

  useEffect(() => {
    console.log({ location });
    location.pathname === "/character/main"
      ? setHeaderLabel("Main character")
      : location.pathname === "/character"
      ? setHeaderLabel("Character")
      : location.pathname === "/game"
      ? setHeaderLabel("You are the hero")
      : location.pathname === "/story"
      ? setHeaderLabel("Story")
      : navigate("/character/main");
    setModeDropdownOpen(false);
  }, [location]);

  return (
    <div className="pl-[20px] pr-[20px] pt-[10px]">
      <div
        className="h-[40px] items-center flex flex-row text-textSecondary cursor-pointer"
        onClick={toggleModeDropdown}
      >
        <span className="font-bold">{headerLabel}</span>
        <div className="h-[24px] w-[24px]">
          <ChevronDown />
        </div>
      </div>
      <div className={clsx({ hidden: !modeDropdownOpen })}>
        <ModeDropdown hide={() => setModeDropdownOpen(false)} />
      </div>
    </div>
  );
};

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/Header/index.ts
```ts
import Header from "./Header";

export default Header;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/LeftPanel.tsx
```tsx
import { NavLink } from "react-router";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import PlusIcon from "../../icons/plus";

const LeftPanel: React.FC = () => {
  return (
    <div className="h-screen w-[260px] bg-lightGray flex flex-col pl-[20px] pr-[20px] pt-[10px]">
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary">
          <div className="h-[24px] w-[24px]">
            <PanelIcon />
          </div>
          <div className="h-[24px] w-[24px]">
            <NewChatIcon />
          </div>
        </div>
      </div>
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] content-center">Characters</div>
        <div className="flex flex-row items-center">
          <div className="h-[20px] w-[20px]">
            <PlusIcon />
          </div>
          <span className="pl-[10px]">New character</span>
        </div>
      </div>
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] content-center">Games</div>
        <div className="flex flex-row items-center">
          <div className="h-[20px] w-[20px]">
            <PlusIcon />
          </div>
          <span className="pl-[10px]">New game</span>
        </div>
      </div>
      <div className="h-auto w-full flex flex-col">
        <div className="font-bold h-[40px] content-center">Stories</div>
        <NavLink to="/story/new">
          <div className="flex flex-row items-center">
            <div className="h-[20px] w-[20px]">
              <PlusIcon />
            </div>
            <span className="pl-[10px]">New story</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/LeftPanel/index.ts
```ts
import LeftPanel from "./LeftPanel";

export default LeftPanel;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/ModeDropdown.tsx
```tsx
import { NavLink } from "react-router";

import useClickOutside from "../../hooks/useClickOutside";

interface ModeDropdownProps {
  hide: () => void;
}

const ModeDropdown: React.FC<ModeDropdownProps> = (props) => {
  useClickOutside(() => {
    props.hide();
  });

  return (
    <div className="rounded-md border-2 border-black p-[10px] w-fit absolute z-10 bg-white">
      <div className="cursor-pointer">
        <NavLink to="/character/main">Main character</NavLink>
      </div>
      <div className="cursor-pointer">
        <NavLink to="/game">You are the hero</NavLink>
      </div>
      <div className="cursor-pointer">
        <NavLink to="/story">Story</NavLink>
      </div>
    </div>
  );
};

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/ModeDropdown/index.ts
```ts
import ModeDropdown from "./ModeDropdown";

export default ModeDropdown;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/SendChatInput.tsx
```tsx
import { useState } from "react";

const SendChatInput: React.FC = () => {
  const [value, setValue] = useState<string>("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`; // Set new height
    setValue(textarea.value);
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full h-fit flex items-center bg-lightGray rounded-lg p-[10px]">
        <textarea
          value={value}
          onChange={handleInput}
          className="bg-transparent border-none placeholder:text-textSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message..."
          rows={1} // Sets initial rows
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/components/SendChatInput/index.ts
```ts
import SendChatInput from "./SendChatInput";

export default SendChatInput;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickAnywhere.tsx
```tsx
import { useEffect } from "react";

function useClickAnywhere(callback: (event: MouseEvent) => void): void {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      callback(event);
    };

    document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [callback]);
}

export default useClickAnywhere;

```

path: /Users/dannybengal/dev/lola/webapp/src/hooks/useClickOutside.tsx
```tsx
import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/chevronDown.tsx
```tsx
const ChevronDown: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default ChevronDown;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/newChat.tsx
```tsx
const NewChat: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default NewChat;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/panel.tsx
```tsx
const Panel: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Panel;

```

path: /Users/dannybengal/dev/lola/webapp/src/icons/plus.tsx
```tsx
const Plus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 3C12.5523 3 13 3.44772 13 4L13 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L13 13L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11L11 11L11 4C11 3.44772 11.4477 3 12 3Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default Plus;

```

path: /Users/dannybengal/dev/lola/webapp/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

h1 {
  font-size: xx-large;
}

h2 {
  font-size: x-large;
}

h3 {
  font-size: large;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

path: /Users/dannybengal/dev/lola/webapp/src/logo.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>
```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/Character.tsx
```tsx
import { useState } from "react";
import clsx from "clsx";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ReportView";

interface CharacterPageProps {
  characterId?: string;
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = ({
  characterId,
  selected,
}) => {
  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "image"
  >("report");

  const handleViewTypeChange = (viewType: "report" | "json" | "image") => {
    setSelectedRightViewType(viewType);
  };

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-textSecondary w-1/2 pr-5 flex flex-col">
        <div className="grow">
          <Chat />
        </div>
        <SendChatInput />
      </div>

      <div className="grow w-1/2 pl-5">
        <div className="mb-2">
          {["report", "JSON", "image"].map((viewType, index, typesArray) => (
            <>
              <span
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
                  )
                }
                className={clsx(
                  "cursor-pointer px-1",
                  selectedRightViewType === viewType.toLowerCase()
                    ? "underline text-gray-500 decoration-gray-500"
                    : ""
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </span>
              <span>{index < typesArray.length - 1 ? " / " : ""}</span>
            </>
          ))}
        </div>
        <div className="mt-4">
          {selectedRightViewType === "report" && (
            <div>
              <ReportView />
            </div>
          )}
          {selectedRightViewType === "json" && (
            <div>
              <JSONView />
            </div>
          )}
          {selectedRightViewType === "image" && (
            <div>
              <ImageView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ImageView.tsx
```tsx
import imageLola from "../../lola.jpeg";

const ImageView: React.FC = () => {
  return (
    <div>
      <img src={imageLola} alt="lola" />
    </div>
  );
};

export default ImageView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.css
```css
.react-json-view {
  max-height: calc(100vh - 144px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.tsx
```tsx
import ReactJson from "react-json-view";

import "./JSONView.css";

const json = {
  name: "Lola",
  age: 24,
  gender: "Femme",
  appearance: {
    hair_color: "Noir",
    eye_color: "Marron",
    height: 1.68,
    body_type: "Svelte",
    skin_tone: "Pâle",
    distinctive_features: [
      {
        feature: "Boucles d'oreilles",
        description:
          "Des boucles d'oreilles en forme de cercle, élégantes et audacieuses.",
      },
    ],
  },
  personality: {
    traits: ["Confiante", "Mystérieuse", "Charismatique"],
    introvert_extrovert_scale: 6,
    moral_alignment: "Chaotique Neutre",
    hobbies: ["Mode", "Photographie", "Exploration urbaine"],
  },
  background: {
    origin: "Paris, France",
    profession: "Créatrice de contenu",
    notable_events: [
      {
        event: "A gagné un concours de mode à 21 ans",
        impact:
          "A renforcé sa confiance et sa passion pour l'expression artistique.",
      },
    ],
  },
  relationships: [
    {
      name: "Alex",
      relation_type: "Ami proche",
      status: "Actif",
      history: "Ils se sont rencontrés lors d'un shooting photo il y a 2 ans.",
    },
  ],
  preferences: {
    likes: [
      "Photographies artistiques",
      "Accessoires élégants",
      "Récits d'aventure",
    ],
    dislikes: ["Conformisme", "Critiques non constructives"],
    romantic_orientation: "Hétérosexuelle",
    sexual_preferences: [
      {
        preference: "Romantisme audacieux",
        description:
          "Préfère des récits où l'audace et l'intimité se rencontrent.",
      },
    ],
  },
  skills: {
    physical: [
      {
        name: "Danse",
        proficiency: 7,
      },
    ],
    mental: [
      {
        name: "Créativité",
        proficiency: 9,
      },
    ],
    social: [
      {
        name: "Communication",
        proficiency: 8,
      },
    ],
  },
  dynamic_attributes: {
    confidence_level: 8,
    stress_level: 3,
    emotional_state: "Détendue",
  },
  story_context: {
    role: "Mentor",
    current_motivation: "Trouver de nouvelles inspirations pour ses créations",
    associated_events: [
      {
        event_id: "fashion_week_paris",
        relationship_to_event: "Invitée spéciale",
      },
    ],
  },
  meta_data: {
    creation_date: "2024-12-14",
    last_modified: "2024-12-14",
    created_by_user_id: "admin",
  },
};

const JSONView: React.FC = () => {
  return (
    <div>
      <ReactJson
        src={json}
        theme="bright:inverted"
        collapsed={false}
        enableClipboard={true}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    </div>
  );
};

export default JSONView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.css
```css
hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

ul {
  margin-bottom: 10px;
}

#ReportViewContainer {
  max-height: calc(100vh - 144px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.tsx
```tsx
import Markdown from "markdown-to-jsx";

import "./ReportView.css";

const markdownText = `
# Lola

## Identification
- **Name**: Lola
- **Age**: 24
- **Gender**: Female

---

## Appearance
- **Hair Color**: Black  
- **Eye Color**: Brown  
- **Height**: 1.68 m  
- **Body Type**: Slim  
- **Skin Tone**: Pale  

### Distinctive Features
- **Earrings**:  
  - Circular earrings, elegant and bold.  

---

## Personality
- **Traits**:  
  - Confident  
  - Mysterious  
  - Charismatic  
- **Introvert-Extrovert Scale**: 6  
- **Moral Alignment**: Chaotic Neutral  

### Hobbies
- Fashion  
- Photography  
- Urban Exploration  

---

## Background
- **Origin**: Paris, France  
- **Profession**: Content Creator  

### Notable Events
1. **Event**: Won a fashion competition at 21  
   - **Impact**: Strengthened her confidence and passion for artistic expression.  

---

## Relationships
- **Name**: Alex  
  - **Relation Type**: Close Friend  
  - **Status**: Active  
  - **History**: They met during a photoshoot 2 years ago.  

---

## Preferences
- **Likes**:  
  - Artistic photography  
  - Elegant accessories  
  - Adventure stories  

- **Dislikes**:  
  - Conformity  
  - Non-constructive criticism  

- **Romantic Orientation**: Heterosexual  

### Sexual Preferences
- **Bold Romance**:  
  - Prefers stories where boldness and intimacy come together.  

---

## Skills

### Physical Skills
- **Dancing**: Proficiency 7  

### Mental Skills
- **Creativity**: Proficiency 9  

### Social Skills
- **Communication**: Proficiency 8  

---

## Dynamic Attributes
- **Confidence Level**: 8  
- **Stress Level**: 3  
- **Emotional State**: Relaxed  

---

## Story Context
- **Role**: Mentor  
- **Current Motivation**: Finding new inspiration for her creations  

### Associated Events
- **Event ID**: \`fashion_week_paris\`  
  - **Relationship to Event**: Special Guest  

---

## Meta Data
- **Creation Date**: 2024-12-14  
- **Last Modified**: 2024-12-14  
- **Created By User ID**: admin  

`;

const ReportView: React.FC = () => {
  return (
    <div id="ReportViewContainer">
      <Markdown>{markdownText}</Markdown>
    </div>
  );
};

export default ReportView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/index.ts
```ts
import CharacterPage from "./Character";

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/Game.tsx
```tsx
const GamePage: React.FC = () => {
  return <div></div>;
};

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/index.ts
```ts
import GamePage from "./Game";

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/NewStory.tsx
```tsx
const NewStoryPage: React.FC = () => {
  return <div></div>;
};

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/index.ts
```ts
import NewStoryPage from "./NewStory";

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/Story.tsx
```tsx
import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";

const StoryPage: React.FC = () => {
  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-col">
      <div className="grow">
        <Chat />
      </div>
      <SendChatInput />
    </div>
  );
};

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/index.ts
```ts
import StoryPage from "./Story";

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/react-app-env.d.ts
```ts
/// <reference types="react-scripts" />

```

path: /Users/dannybengal/dev/lola/webapp/src/reportWebVitals.ts
```ts
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

path: /Users/dannybengal/dev/lola/webapp/src/setupTests.ts
```ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```


```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/Character.tsx
```tsx
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";

interface CharacterPageProps {
  characterId?: string;
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const [characterId, setCharacterId] = useState<string | undefined>(
    params.characterId
  );

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "image"
  >("report");

  const handleViewTypeChange = (viewType: "report" | "json" | "image") => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    params.characterId && setCharacterId(params.characterId);
  }, [params.characterId]);

  useEffect(() => {
    props.characterId && setCharacterId(props.characterId);
  }, [props.characterId]);

  useEffect(() => {
    const mainId = "mainId";
    if (props.selected?.type === "main") setCharacterId(mainId);
  }, [props.selected]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-textSecondary w-1/2 pr-5 flex flex-col">
        <div className="grow">
          <Chat type="character" id={characterId} />
        </div>
        <SendChatInput type="character" id={characterId} />
      </div>

      <div className="grow w-1/2 pl-5">
        <div className="mb-2">
          {["report", "JSON", "image"].map((viewType, index, typesArray) => (
            <>
              <span
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
                  )
                }
                className={clsx(
                  "cursor-pointer px-1",
                  selectedRightViewType === viewType.toLowerCase()
                    ? "underline text-gray-500 decoration-gray-500"
                    : ""
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </span>
              <span>{index < typesArray.length - 1 ? " / " : ""}</span>
            </>
          ))}
        </div>
        <div className="mt-4">
          {selectedRightViewType === "report" && (
            <div>
              <ReportView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "json" && (
            <div>
              <JSONView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "image" && (
            <div>
              <ImageView type="character" id={characterId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ImageView.tsx
```tsx
import imageDani from "../../dani.webp";

interface ImageViewProps {
  type: "character" | "story";
  id?: string;
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <img src={imageDani} alt="Dani" />
      )}
    </div>
  );
};

export default ImageView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.css
```css
.react-json-view {
  max-height: calc(100vh - 144px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.tsx
```tsx
import ReactJson from "react-json-view";

import "./JSONView.css";

const json = {
  name: "Dani",
  age: 32,
  gender: "Homme",
  appearance: {
    hair_color: "Noir",
    eye_color: "Marron",
    height: 1.78,
    body_type: "Athlétique",
    skin_tone: "Pâle",
    distinctive_features: [
      {
        feature: "Montre élégante",
        description:
          "Une montre en acier inoxydable, minimaliste et sophistiquée.",
      },
    ],
  },
  personality: {
    traits: ["Confident", "Mystérieux", "Charismatique"],
    introvert_extrovert_scale: 6,
    moral_alignment: "Chaotique Neutre",
    hobbies: ["Mode", "Photographie", "Exploration urbaine"],
  },
  background: {
    origin: "Paris, France",
    profession: "Créateur de contenu",
    notable_events: [
      {
        event: "A remporté un concours de photographie à 28 ans",
        impact:
          "A renforcé sa confiance et sa passion pour l'exploration créative.",
      },
    ],
  },
  relationships: [
    {
      name: "Alexandra",
      relation_type: "Amie proche",
      status: "Actif",
      history:
        "Ils se sont rencontrés lors d'une exposition photo il y a 4 ans.",
    },
  ],
  preferences: {
    likes: [
      "Photographies artistiques",
      "Accessoires élégants",
      "Récits d'aventure",
    ],
    dislikes: ["Conformisme", "Critiques non constructives"],
    romantic_orientation: "Hétérosexuel",
    sexual_preferences: [
      {
        preference: "Romantisme audacieux",
        description:
          "Préfère des récits où l'audace et l'intimité se rencontrent.",
      },
    ],
  },
  skills: {
    physical: [
      {
        name: "Parkour",
        proficiency: 7,
      },
    ],
    mental: [
      {
        name: "Créativité",
        proficiency: 9,
      },
    ],
    social: [
      {
        name: "Communication",
        proficiency: 8,
      },
    ],
  },
  dynamic_attributes: {
    confidence_level: 8,
    stress_level: 3,
    emotional_state: "Détendu",
  },
  story_context: {
    role: "Mentor",
    current_motivation: "Trouver de nouvelles inspirations pour ses créations",
    associated_events: [
      {
        event_id: "fashion_week_paris",
        relationship_to_event: "Invité spécial",
      },
    ],
  },
  meta_data: {
    creation_date: "2024-12-14",
    last_modified: "2024-12-14",
    created_by_user_id: "admin",
  },
};

interface JSONViewProps {
  type: "character" | "story";
  id?: string;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <ReactJson
          src={json}
          theme="bright:inverted"
          collapsed={false}
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      )}
    </div>
  );
};

export default JSONView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.css
```css
hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

ul {
  margin-bottom: 10px;
}

#ReportViewContainer {
  max-height: calc(100vh - 144px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.tsx
```tsx
import Markdown from "markdown-to-jsx";

import "./ReportView.css";

const markdownText = `
# Dani

## Identification
- **Name**: Dani
- **Age**: 32
- **Gender**: Male

---

## Appearance
- **Hair Color**: Black  
- **Eye Color**: Brown  
- **Height**: 1.78 m  
- **Body Type**: Athletic  
- **Skin Tone**: Pale  

### Distinctive Features
- **Elegant Watch**:  
  - A stainless steel watch, minimalist and sophisticated.  

---

## Personality
- **Traits**:  
  - Confident  
  - Mysterious  
  - Charismatic  
- **Introvert-Extrovert Scale**: 6  
- **Moral Alignment**: Chaotic Neutral  

### Hobbies
- Fashion  
- Photography  
- Urban Exploration  

---

## Background
- **Origin**: Paris, France  
- **Profession**: Content Creator  

### Notable Events
1. **Event**: Won a photography contest at 28  
   - **Impact**: Strengthened his confidence and passion for creative exploration.  

---

## Relationships
- **Name**: Alexandra  
  - **Relation Type**: Close Friend  
  - **Status**: Active  
  - **History**: They met during a photography exhibition 4 years ago.  

---

## Preferences
- **Likes**:  
  - Artistic photography  
  - Elegant accessories  
  - Adventure stories  

- **Dislikes**:  
  - Conformity  
  - Non-constructive criticism  

- **Romantic Orientation**: Heterosexual  

### Sexual Preferences
- **Bold Romance**:  
  - Prefers stories where boldness and intimacy come together.  

---

## Skills

### Physical Skills
- **Parkour**: Proficiency 7  

### Mental Skills
- **Creativity**: Proficiency 9  

### Social Skills
- **Communication**: Proficiency 8  

---

## Dynamic Attributes
- **Confidence Level**: 8  
- **Stress Level**: 3  
- **Emotional State**: Relaxed  

---

## Story Context
- **Role**: Mentor  
- **Current Motivation**: Finding new inspiration for his creations  

### Associated Events
- **Event ID**: \`fashion_week_paris\`  
  - **Relationship to Event**: Special Guest  

---

## Meta Data
- **Creation Date**: 2024-12-14  
- **Last Modified**: 2024-12-14  
- **Created By User ID**: admin  

`;

interface ReportViewProps {
  type: "character" | "story";
  id?: string;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  return (
    <div id="ReportViewContainer">
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <Markdown>{markdownText}</Markdown>
      )}
    </div>
  );
};

export default ReportView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/index.ts
```ts
import CharacterPage from "./Character";

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/Game.tsx
```tsx
const GamePage: React.FC = () => {
  return <div></div>;
};

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/index.ts
```ts
import GamePage from "./Game";

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewGame/NewGame.tsx
```tsx
const NewGamePage: React.FC = () => {
  return <div></div>;
};

export default NewGamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewGame/index.ts
```ts
import NewGamePage from "./NewGame";

export default NewGamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/NewStory.tsx
```tsx
const NewStoryPage: React.FC = () => {
  return <div></div>;
};

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/index.ts
```ts
import NewStoryPage from "./NewStory";

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/Story.tsx
```tsx
import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";

const StoryPage: React.FC = () => {
  return (
    <div className="flex justify-center h-full">
      <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-col max-w-[715px]">
        <div className="grow">
          <Chat type="story" />
        </div>
        <SendChatInput type="story" />
      </div>
    </div>
  );
};

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/index.ts
```ts
import StoryPage from "./Story";

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/react-app-env.d.ts
```ts
/// <reference types="react-scripts" />

```

path: /Users/dannybengal/dev/lola/webapp/src/reportWebVitals.ts
```ts
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

path: /Users/dannybengal/dev/lola/webapp/src/setupTests.ts
```ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```


```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/Character.tsx
```tsx
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";

interface CharacterPageProps {
  characterId?: string;
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const [characterId, setCharacterId] = useState<string | undefined>(
    params.characterId
  );

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "image"
  >("report");

  const handleViewTypeChange = (viewType: "report" | "json" | "image") => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    params.characterId && setCharacterId(params.characterId);
  }, [params.characterId]);

  useEffect(() => {
    props.characterId && setCharacterId(props.characterId);
  }, [props.characterId]);

  useEffect(() => {
    const mainId = "mainId";
    if (props.selected?.type === "main") setCharacterId(mainId);
  }, [props.selected]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-textSecondary w-1/2 pr-5 flex flex-col">
        <div className="grow">
          <Chat type="character" id={characterId} />
        </div>
        <SendChatInput type="character" id={characterId} />
      </div>

      <div className="grow w-1/2 pl-5 flex items-center flex-col">
        <div className="bg-lightGray p-[5px] rounded-lg w-fit flex flex-row">
          {["report", "JSON", "image"].map((viewType) => (
            <>
              <div
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
                  )
                }
                className={clsx(
                  "cursor-pointer",
                  "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                  "rounded-lg",
                  {
                    "text-textPrimary border border-borderLight bg-white":
                      selectedRightViewType === viewType.toLowerCase(),
                    "text-gray-400":
                      selectedRightViewType !== viewType.toLowerCase(),
                  }
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </div>
            </>
          ))}
        </div>
        <div className="mt-4">
          {selectedRightViewType === "report" && (
            <div>
              <ReportView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "json" && (
            <div>
              <JSONView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "image" && (
            <div>
              <ImageView type="character" id={characterId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ImageView.tsx
```tsx
import imageDani from "../../dani.webp";

interface ImageViewProps {
  type: "character" | "story";
  id?: string;
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <img src={imageDani} alt="Dani" />
      )}
    </div>
  );
};

export default ImageView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.css
```css
.react-json-view {
  max-height: calc(100vh - 170px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.tsx
```tsx
import ReactJson from "react-json-view";

import "./JSONView.css";

const json = {
  name: "Dani",
  age: 32,
  gender: "Homme",
  appearance: {
    hair_color: "Noir",
    eye_color: "Marron",
    height: 1.78,
    body_type: "Athlétique",
    skin_tone: "Pâle",
    distinctive_features: [
      {
        feature: "Montre élégante",
        description:
          "Une montre en acier inoxydable, minimaliste et sophistiquée.",
      },
    ],
  },
  personality: {
    traits: ["Confident", "Mystérieux", "Charismatique"],
    introvert_extrovert_scale: 6,
    moral_alignment: "Chaotique Neutre",
    hobbies: ["Mode", "Photographie", "Exploration urbaine"],
  },
  background: {
    origin: "Paris, France",
    profession: "Créateur de contenu",
    notable_events: [
      {
        event: "A remporté un concours de photographie à 28 ans",
        impact:
          "A renforcé sa confiance et sa passion pour l'exploration créative.",
      },
    ],
  },
  relationships: [
    {
      name: "Alexandra",
      relation_type: "Amie proche",
      status: "Actif",
      history:
        "Ils se sont rencontrés lors d'une exposition photo il y a 4 ans.",
    },
  ],
  preferences: {
    likes: [
      "Photographies artistiques",
      "Accessoires élégants",
      "Récits d'aventure",
    ],
    dislikes: ["Conformisme", "Critiques non constructives"],
    romantic_orientation: "Hétérosexuel",
    sexual_preferences: [
      {
        preference: "Romantisme audacieux",
        description:
          "Préfère des récits où l'audace et l'intimité se rencontrent.",
      },
    ],
  },
  skills: {
    physical: [
      {
        name: "Parkour",
        proficiency: 7,
      },
    ],
    mental: [
      {
        name: "Créativité",
        proficiency: 9,
      },
    ],
    social: [
      {
        name: "Communication",
        proficiency: 8,
      },
    ],
  },
  dynamic_attributes: {
    confidence_level: 8,
    stress_level: 3,
    emotional_state: "Détendu",
  },
  story_context: {
    role: "Mentor",
    current_motivation: "Trouver de nouvelles inspirations pour ses créations",
    associated_events: [
      {
        event_id: "fashion_week_paris",
        relationship_to_event: "Invité spécial",
      },
    ],
  },
  meta_data: {
    creation_date: "2024-12-14",
    last_modified: "2024-12-14",
    created_by_user_id: "admin",
  },
};

interface JSONViewProps {
  type: "character" | "story";
  id?: string;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <ReactJson
          src={json}
          theme="bright:inverted"
          collapsed={false}
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      )}
    </div>
  );
};

export default JSONView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.css
```css
hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

ul {
  margin-bottom: 10px;
}

#ReportViewContainer {
  max-height: calc(100vh - 170px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.tsx
```tsx
import Markdown from "markdown-to-jsx";

import "./ReportView.css";

const markdownText = `
# Dani

## Identification
- **Name**: Dani
- **Age**: 32
- **Gender**: Male

---

## Appearance
- **Hair Color**: Black  
- **Eye Color**: Brown  
- **Height**: 1.78 m  
- **Body Type**: Athletic  
- **Skin Tone**: Pale  

### Distinctive Features
- **Elegant Watch**:  
  - A stainless steel watch, minimalist and sophisticated.  

---

## Personality
- **Traits**:  
  - Confident  
  - Mysterious  
  - Charismatic  
- **Introvert-Extrovert Scale**: 6  
- **Moral Alignment**: Chaotic Neutral  

### Hobbies
- Fashion  
- Photography  
- Urban Exploration  

---

## Background
- **Origin**: Paris, France  
- **Profession**: Content Creator  

### Notable Events
1. **Event**: Won a photography contest at 28  
   - **Impact**: Strengthened his confidence and passion for creative exploration.  

---

## Relationships
- **Name**: Alexandra  
  - **Relation Type**: Close Friend  
  - **Status**: Active  
  - **History**: They met during a photography exhibition 4 years ago.  

---

## Preferences
- **Likes**:  
  - Artistic photography  
  - Elegant accessories  
  - Adventure stories  

- **Dislikes**:  
  - Conformity  
  - Non-constructive criticism  

- **Romantic Orientation**: Heterosexual  

### Sexual Preferences
- **Bold Romance**:  
  - Prefers stories where boldness and intimacy come together.  

---

## Skills

### Physical Skills
- **Parkour**: Proficiency 7  

### Mental Skills
- **Creativity**: Proficiency 9  

### Social Skills
- **Communication**: Proficiency 8  

---

## Dynamic Attributes
- **Confidence Level**: 8  
- **Stress Level**: 3  
- **Emotional State**: Relaxed  

---

## Story Context
- **Role**: Mentor  
- **Current Motivation**: Finding new inspiration for his creations  

### Associated Events
- **Event ID**: \`fashion_week_paris\`  
  - **Relationship to Event**: Special Guest  

---

## Meta Data
- **Creation Date**: 2024-12-14  
- **Last Modified**: 2024-12-14  
- **Created By User ID**: admin  

`;

interface ReportViewProps {
  type: "character" | "story";
  id?: string;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  return (
    <div id="ReportViewContainer">
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <Markdown>{markdownText}</Markdown>
      )}
    </div>
  );
};

export default ReportView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/index.ts
```ts
import CharacterPage from "./Character";

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/Game.tsx
```tsx
const GamePage: React.FC = () => {
  return <div></div>;
};

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/index.ts
```ts
import GamePage from "./Game";

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewGame/NewGame.tsx
```tsx
const NewGamePage: React.FC = () => {
  return <div></div>;
};

export default NewGamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewGame/index.ts
```ts
import NewGamePage from "./NewGame";

export default NewGamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/NewStory.tsx
```tsx
const NewStoryPage: React.FC = () => {
  return <div></div>;
};

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/index.ts
```ts
import NewStoryPage from "./NewStory";

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/Story.tsx
```tsx
import { useParams } from "react-router";
import { useEffect, useRef } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";

const StoryPage: React.FC = () => {
  const params = useParams();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
        <div
          ref={chatContainerRef}
          className="grow overflow-y-scroll justify-center flex"
        >
          <Chat type="story" id={params.storyId} />
        </div>
        <div className="justify-center flex w-full">
          <div className="w-[715px]">
            <SendChatInput type="story" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/index.ts
```ts
import StoryPage from "./Story";

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/react-app-env.d.ts
```ts
/// <reference types="react-scripts" />

```

path: /Users/dannybengal/dev/lola/webapp/src/reportWebVitals.ts
```ts
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

path: /Users/dannybengal/dev/lola/webapp/src/setupTests.ts
```ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

path: /Users/dannybengal/dev/lola/webapp/src/store/features/app/appSlice.ts
```ts
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  isLeftPanelOpen: boolean;
  isSettingsOpen: boolean;
}

// Define the initial state using that type
const initialState: AppState = {
  isLeftPanelOpen: true,
  isSettingsOpen: false,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleLeftPanel: (state) => {
      state.isLeftPanelOpen = !state.isLeftPanelOpen;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
  },
});

export const { toggleLeftPanel, toggleSettings } = appSlice.actions;

export default appSlice.reducer;

```

path: /Users/dannybengal/dev/lola/webapp/src/store/hooks.ts
```ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

```

path: /Users/dannybengal/dev/lola/webapp/src/store/store.ts
```ts
import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./features/app/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```


```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/Character.tsx
```tsx
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

interface CharacterPageProps {
  characterId?: string;
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const [characterId, setCharacterId] = useState<string | undefined>(
    params.characterId
  );
  const dispatch = useAppDispatch();

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "image"
  >("report");

  const handleViewTypeChange = (viewType: "report" | "json" | "image") => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    params.characterId && setCharacterId(params.characterId);
  }, [params.characterId]);

  useEffect(() => {
    props.characterId && setCharacterId(props.characterId);
  }, [props.characterId]);

  useEffect(() => {
    const mainId = "mainId";
    if (props.selected?.type === "main") setCharacterId(mainId);
  }, [props.selected]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "character", objectId: characterId })
    );
  }, [characterId]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-borderColor w-1/2 pr-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="grow overflow-y-scroll">
          <Chat type="character" id={characterId} />
        </div>
        <SendChatInput type="character" id={characterId} />
      </div>

      <div className="grow w-1/2 pl-5 flex items-center flex-col">
        <div className="bg-lightGray p-[5px] rounded-lg w-fit flex flex-row">
          {["report", "JSON", "image"].map((viewType) => (
            <>
              <div
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
                  )
                }
                className={clsx(
                  "cursor-pointer",
                  "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                  "rounded-lg",
                  {
                    "text-textPrimary border border-borderLight bg-white":
                      selectedRightViewType === viewType.toLowerCase(),
                    "text-gray-400":
                      selectedRightViewType !== viewType.toLowerCase(),
                  }
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </div>
            </>
          ))}
        </div>
        <div className="mt-4">
          {selectedRightViewType === "report" && (
            <div>
              <ReportView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "json" && (
            <div>
              <JSONView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "image" && (
            <div>
              <ImageView type="character" id={characterId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ImageView.tsx
```tsx
import imageDani from "../../dani.webp";

interface ImageViewProps {
  type: "character" | "story";
  id?: string;
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <img src={imageDani} alt="Dani" />
      )}
    </div>
  );
};

export default ImageView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.css
```css
.react-json-view {
  max-height: calc(100vh - 170px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/JSONView.tsx
```tsx
import ReactJson from "react-json-view";

import "./JSONView.css";

const json = {
  name: "Dani",
  age: 32,
  gender: "Homme",
  appearance: {
    hair_color: "Noir",
    eye_color: "Marron",
    height: 1.78,
    body_type: "Athlétique",
    skin_tone: "Pâle",
    distinctive_features: [
      {
        feature: "Montre élégante",
        description:
          "Une montre en acier inoxydable, minimaliste et sophistiquée.",
      },
    ],
  },
  personality: {
    traits: ["Confident", "Mystérieux", "Charismatique"],
    introvert_extrovert_scale: 6,
    moral_alignment: "Chaotique Neutre",
    hobbies: ["Mode", "Photographie", "Exploration urbaine"],
  },
  background: {
    origin: "Paris, France",
    profession: "Créateur de contenu",
    notable_events: [
      {
        event: "A remporté un concours de photographie à 28 ans",
        impact:
          "A renforcé sa confiance et sa passion pour l'exploration créative.",
      },
    ],
  },
  relationships: [
    {
      name: "Alexandra",
      relation_type: "Amie proche",
      status: "Actif",
      history:
        "Ils se sont rencontrés lors d'une exposition photo il y a 4 ans.",
    },
  ],
  preferences: {
    likes: [
      "Photographies artistiques",
      "Accessoires élégants",
      "Récits d'aventure",
    ],
    dislikes: ["Conformisme", "Critiques non constructives"],
    romantic_orientation: "Hétérosexuel",
    sexual_preferences: [
      {
        preference: "Romantisme audacieux",
        description:
          "Préfère des récits où l'audace et l'intimité se rencontrent.",
      },
    ],
  },
  skills: {
    physical: [
      {
        name: "Parkour",
        proficiency: 7,
      },
    ],
    mental: [
      {
        name: "Créativité",
        proficiency: 9,
      },
    ],
    social: [
      {
        name: "Communication",
        proficiency: 8,
      },
    ],
  },
  dynamic_attributes: {
    confidence_level: 8,
    stress_level: 3,
    emotional_state: "Détendu",
  },
  story_context: {
    role: "Mentor",
    current_motivation: "Trouver de nouvelles inspirations pour ses créations",
    associated_events: [
      {
        event_id: "fashion_week_paris",
        relationship_to_event: "Invité spécial",
      },
    ],
  },
  meta_data: {
    creation_date: "2024-12-14",
    last_modified: "2024-12-14",
    created_by_user_id: "admin",
  },
};

interface JSONViewProps {
  type: "character" | "story";
  id?: string;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <ReactJson
          src={json}
          theme="bright:inverted"
          collapsed={false}
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      )}
    </div>
  );
};

export default JSONView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.css
```css
hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

ul {
  margin-bottom: 10px;
}

#ReportViewContainer {
  max-height: calc(100vh - 170px);
  overflow-y: scroll;
}

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/ReportView.tsx
```tsx
import Markdown from "markdown-to-jsx";

import "./ReportView.css";

const markdownText = `
# Dani

## Identification
- **Name**: Dani
- **Age**: 32
- **Gender**: Male

---

## Appearance
- **Hair Color**: Black  
- **Eye Color**: Brown  
- **Height**: 1.78 m  
- **Body Type**: Athletic  
- **Skin Tone**: Pale  

### Distinctive Features
- **Elegant Watch**:  
  - A stainless steel watch, minimalist and sophisticated.  

---

## Personality
- **Traits**:  
  - Confident  
  - Mysterious  
  - Charismatic  
- **Introvert-Extrovert Scale**: 6  
- **Moral Alignment**: Chaotic Neutral  

### Hobbies
- Fashion  
- Photography  
- Urban Exploration  

---

## Background
- **Origin**: Paris, France  
- **Profession**: Content Creator  

### Notable Events
1. **Event**: Won a photography contest at 28  
   - **Impact**: Strengthened his confidence and passion for creative exploration.  

---

## Relationships
- **Name**: Alexandra  
  - **Relation Type**: Close Friend  
  - **Status**: Active  
  - **History**: They met during a photography exhibition 4 years ago.  

---

## Preferences
- **Likes**:  
  - Artistic photography  
  - Elegant accessories  
  - Adventure stories  

- **Dislikes**:  
  - Conformity  
  - Non-constructive criticism  

- **Romantic Orientation**: Heterosexual  

### Sexual Preferences
- **Bold Romance**:  
  - Prefers stories where boldness and intimacy come together.  

---

## Skills

### Physical Skills
- **Parkour**: Proficiency 7  

### Mental Skills
- **Creativity**: Proficiency 9  

### Social Skills
- **Communication**: Proficiency 8  

---

## Dynamic Attributes
- **Confidence Level**: 8  
- **Stress Level**: 3  
- **Emotional State**: Relaxed  

---

## Story Context
- **Role**: Mentor  
- **Current Motivation**: Finding new inspiration for his creations  

### Associated Events
- **Event ID**: \`fashion_week_paris\`  
  - **Relationship to Event**: Special Guest  

---

## Meta Data
- **Creation Date**: 2024-12-14  
- **Last Modified**: 2024-12-14  
- **Created By User ID**: admin  

`;

interface ReportViewProps {
  type: "character" | "story";
  id?: string;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  return (
    <div id="ReportViewContainer">
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <Markdown>{markdownText}</Markdown>
      )}
    </div>
  );
};

export default ReportView;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Character/index.ts
```ts
import CharacterPage from "./Character";

export default CharacterPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/Game.tsx
```tsx
import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";

import Chat from "../../components/Chat";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

const lastGameId = "098DF098SDFQ08F-dani-tome-1";

const actions = [
  {
    action_title: "Invite Maya to a Private Lounge",
    action_description:
      "Leonardo discreetly invites Maya to a secluded lounge to test her intentions and introduce her to the inner circle, creating a sense of mystery and allure.",
    sex_level: 30,
    suited_for_main_character: 85,
  },
  {
    action_title: "Challenge Maya to a High-Stakes Game",
    action_description:
      "Leonardo suggests Maya join a high-stakes poker game where the bets go beyond money, as a way to gauge her nerves and intentions.",
    sex_level: 20,
    suited_for_main_character: 70,
  },
  {
    action_title: "Reveal the Party’s True Purpose",
    action_description:
      "Leonardo takes Maya to a hidden area of the mansion where the elite engage in exclusive activities, testing her reaction to decide if she can be trusted.",
    sex_level: 60,
    suited_for_main_character: 90,
  },
  {
    action_title: "Dance Floor Seduction",
    action_description:
      "Leonardo joins Maya on the dance floor, using his charm and subtle physical cues to gauge her comfort and intentions.",
    sex_level: 50,
    suited_for_main_character: 80,
  },
  {
    action_title: "Introduce Maya to Diddy",
    action_description:
      "Leonardo brings Maya into Diddy’s circle to see how she handles the intensity of their personalities and the subtle interrogations.",
    sex_level: 40,
    suited_for_main_character: 75,
  },
  {
    action_title: "Share a Personal Secret",
    action_description:
      "Leonardo confides a personal anecdote or secret to Maya, creating an intimate moment to disarm her and test her sincerity.",
    sex_level: 20,
    suited_for_main_character: 95,
  },
  {
    action_title: "Test Maya’s Resolve",
    action_description:
      "Leonardo invites Maya to participate in a seemingly innocent yet suggestive party game, pushing her boundaries subtly.",
    sex_level: 55,
    suited_for_main_character: 80,
  },
];

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location.pathname === "/game") {
      lastGameId ? navigate("/game/" + lastGameId) : navigate("/game/new");
    }
  }, []);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "game", objectId: params.gameId })
    );
  }, [params.gameId]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-borderColor w-1/2 pr-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="grow overflow-y-scroll">
          <Chat type="game" id={params.gameId} />
        </div>
      </div>
      <div className="grow w-1/2 pl-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="overflow-y-scroll grid grid-cols-1">
          {actions.map((action) => (
            <div className="flex flex-col p-[20px] border-b border-borderColor hover:bg-lightGray cursor-pointer">
              <div className="font-semibold">{action.action_title}</div>
              <div className="">{action.action_description}</div>
              <div className="">
                Sex: {action.sex_level}% ; Character opinion:{" "}
                {action.suited_for_main_character}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Game/index.ts
```ts
import GamePage from "./Game";

export default GamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewGame/NewGame.tsx
```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";

import imageDani from "../../dani.webp";
import imageLola from "../../lola.jpeg";

import SendIcon from "../../icons/send";
import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";

import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

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
  const dispatch = useAppDispatch();

  const createGame = () => {
    navigate("/game/098DF098SDFQ08F-dani-tome-1");
  };

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: "game", objectId: null }));
  }, []);

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
        <div className="font-semibold text-lg mb-[20px]">Choose a hero</div>
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
          Choose a game
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

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewGame/index.ts
```ts
import NewGamePage from "./NewGame";

export default NewGamePage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/NewStory.tsx
```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";

import imageDani from "../../dani.webp";
import imageLola from "../../lola.jpeg";

import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import SendIcon from "../../icons/send";

import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

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
  {
    id: "2329890kj09-claire-2",
    label: "Claire",
    image: imageLola,
  },
  {
    id: "dani01-2",
    label: "Dani",
    image: imageDani,
  },
];

const NewStoryPage: React.FC = () => {
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const createStory = () => {
    navigate("/story/098DF098SDFQ08F-dani-dentist-and-claire");
  };

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: "story", objectId: null }));
  }, []);

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
            placeholder="Dani's dentist, she is a sexy 34yo petite brunette"
            className="w-[60%] outline-none border rounded-full p-[10px]"
            onKeyDown={(e) => e.key === "Enter" && setShowAIInput(false)}
          />
        </div>
        <div className="font-semibold text-lg mb-[20px]">Characters</div>
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
          <div
            className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary cursor-pointer"
            onClick={() => setShowAIInput(true)}
          >
            <PlusIcon />
          </div>
        </div>
        <div className="font-semibold text-lg mt-[40px] mb-[20px]">Context</div>
        <div className="flex flex-row items-center">
          <textarea className="rounded-lg border border-lightBorder resize-none h-[100px] w-[400px] outline-none p-[10px]"></textarea>
          <div
            className="ml-[20px] w-[32px] h-[32px] text-white bg-black rounded-full flex justify-center items-center cursor-pointer"
            onClick={createStory}
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/NewStory/index.ts
```ts
import NewStoryPage from "./NewStory";

export default NewStoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/Story.tsx
```tsx
import { useParams } from "react-router";
import { useEffect, useRef } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

const StoryPage: React.FC = () => {
  const params = useParams();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "story", objectId: params.storyId })
    );
  }, [params.storyId]);

  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
        <div
          ref={chatContainerRef}
          className="grow overflow-y-scroll justify-center flex"
        >
          <Chat type="story" id={params.storyId} />
        </div>
        <div className="justify-center flex w-full">
          <div className="w-[715px]">
            <SendChatInput type="story" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/pages/Story/index.ts
```ts
import StoryPage from "./Story";

export default StoryPage;

```

path: /Users/dannybengal/dev/lola/webapp/src/react-app-env.d.ts
```ts
/// <reference types="react-scripts" />

```

path: /Users/dannybengal/dev/lola/webapp/src/reportWebVitals.ts
```ts
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

path: /Users/dannybengal/dev/lola/webapp/src/setupTests.ts
```ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

```

path: /Users/dannybengal/dev/lola/webapp/src/store/features/app/appSlice.ts
```ts
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AppState {
  isLeftPanelOpen: boolean;
  isSettingsOpen: boolean;
  currentlyViewing: {
    objectType: string;
    objectId: string | null;
  };
}

// Define the initial state using that type
const initialState: AppState = {
  isLeftPanelOpen: true,
  isSettingsOpen: false,
  currentlyViewing: {
    objectType: "",
    objectId: "",
  },
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleLeftPanel: (state) => {
      state.isLeftPanelOpen = !state.isLeftPanelOpen;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setCurrentlyViewing: (state, action) => {
      state.currentlyViewing = action.payload;
    },
  },
});

export const { toggleLeftPanel, toggleSettings, setCurrentlyViewing } =
  appSlice.actions;

export default appSlice.reducer;

```

path: /Users/dannybengal/dev/lola/webapp/src/store/hooks.ts
```ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

```

path: /Users/dannybengal/dev/lola/webapp/src/store/store.ts
```ts
import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./features/app/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

