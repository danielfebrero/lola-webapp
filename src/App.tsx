import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ReactGA from "react-ga4";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

import LeftPanel from "./components/LeftPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Overlay from "./components/Overlay";
import Settings from "./components/Settings";
import Init from "./components/Init";
import LoginModal from "./components/LoginModal";

import CharacterPage from "./routes/Character";
import GamePage from "./routes/Game";
import StoryPage from "./routes/Story";
import LolaPage from "./routes/Lola";
import NewStoryPage from "./routes/NewStory";
import NewGamePage from "./routes/NewGame";
import LoginSuccess from "./routes/LoginSuccess";
import SilentRenew from "./routes/SilentRenew";

import { store } from "./store/store";

import "./i18n";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GGRb4RlVb",
  client_id: "6hg2ttnt7v00aflhj0qbgm0dgj",
  redirect_uri: window.location.origin + "/login/success",
  response_type: "code",
  scope: "phone openid email",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: window.location.origin + "/login/silent-renew",
};

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize("G-43V6GGK855");
  }, []);
  return (
    <AuthProvider {...cognitoAuthConfig}>
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
    </AuthProvider>
  );
};

export default App;
