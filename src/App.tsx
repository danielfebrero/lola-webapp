// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ReactGA from "react-ga4";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { UserLogProvider } from "@userlog/next";

import MainLayout from "./components/MainLayout";
import Init from "./components/Init";

import CharacterPage from "./routes/Character";
import GamePage from "./routes/Game";
import StoryPage from "./routes/Story";
import LolaPage from "./routes/Lola";
import NewStoryPage from "./routes/NewStory";
import NewGamePage from "./routes/NewGame";
import LoginSuccess from "./routes/LoginSuccess";
import SilentRenew from "./routes/SilentRenew";
import LandingPage from "./routes/Landing";
import ExplorePage from "./routes/Explore";

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
        <UserLogProvider
          api_key={"JwhVr4bpczMbGntosgQkjduKjQU37hYV"}
          project={"Lola.la"}
        >
          <BrowserRouter>
            <Analytics />
            <SpeedInsights />
            <Init />
            <Routes>
              {/* Landing Page without layout */}

              <Route path="/" element={<LandingPage />} /> */}
              {/* <Route path="/18" element={<LandingPage />} />

              {/* All other routes with MainLayout */}
              <Route element={<MainLayout />}>
                {/* <Route
                  path="/"
                  element={<Navigate to="/explore/latest" replace={true} />}
                />
                <Route
                  path="/18"
                  element={<Navigate to="/explore/latest" replace={true} />}
                /> */}
                <Route path="/login/silent-renew" element={<SilentRenew />} />
                <Route path="/login/success" element={<LoginSuccess />} />
                <Route
                  path="/explore/latest"
                  element={<ExplorePage type="latest" />}
                />
                <Route
                  path="/explore/best"
                  element={<ExplorePage type="best" />}
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
              </Route>

              <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
          </BrowserRouter>
        </UserLogProvider>
      </Provider>
    </AuthProvider>
  );
};

export default App;
