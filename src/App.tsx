import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Overlay from "./components/Overlay";
import Settings from "./components/Settings";
import Init from "./components/Init";
import LoginModal from "./components/LoginModal";

import CharacterPage from "./pages/Character";
import GamePage from "./pages/Game";
import StoryPage from "./pages/Story";
import LolaPage from "./pages/Lola";
import NewStoryPage from "./pages/NewStory";
import NewGamePage from "./pages/NewGame";

import { store } from "./store/store";

import "./i18n";

const App: React.FC = () => {
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
        <div className="app text-textPrimary flex flex-ro no-scrollbar overflow-hidden">
          <LeftPanel />
          <div className="flex flex-col h-screen overflow-y-scroll w-full z-10 bg-white no-scrollbar">
            <div className="flex flex-col grow overflow-y-scroll no-scrollbar">
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
