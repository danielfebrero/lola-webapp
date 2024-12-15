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

