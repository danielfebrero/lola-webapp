import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
