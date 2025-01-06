import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ReactGA from "react-ga4";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Overlay from "./components/Overlay";
import Settings from "./components/Settings";
import Init from "./components/Init";
import LoginModal from "./components/LoginModal";

import CharacterPage from "./paths/Character";
import GamePage from "./paths/Game";
import StoryPage from "./paths/Story";
import LolaPage from "./paths/Lola";
import NewStoryPage from "./paths/NewStory";
import NewGamePage from "./paths/NewGame";
import LoginSuccess from "./paths/LoginSuccess";
import SilentRenew from "./paths/SilentRenew";

import { store } from "./store/store";

import "./i18n";

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize("G-43V6GGK855");
  }, []);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Analytics />
        <SpeedInsights />
        <Init />
        <Overlay>
          <Settings />
          <LoginModal />
        </Overlay>
        <div className="app text-textPrimary dark:text-darkTextPrimary flex flex-ro no-scrollbar overflow-hidden">
          <LeftPanel />
          <div className="flex flex-col h-screen overflow-y-scroll w-full z-10 bg-white dark:bg-darkMainSurfacePrimary no-scrollbar">
            <div className="flex flex-col grow overflow-y-scroll no-scrollbar">
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/character/new" replace />}
                />
                <Route path="/login/silent-renew" element={<SilentRenew />} />
                <Route path="/login/success" element={<LoginSuccess />} />
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
                <Route path="/lola/:conversationId" element={<LolaPage />} />
                <Route path="/lola/new" element={<LolaPage />} />
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
