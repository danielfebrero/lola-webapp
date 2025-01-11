import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSocketConnection,
  setIsDataLoaded,
  setIsSmallScreen,
  toggleLoginModal,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

console.log({ dev: process.env.NODE_ENV });

const WEBSOCKET_URL =
  process.env.NODE_ENV === "development"
    ? "wss://6nk800sp9d.execute-api.us-east-1.amazonaws.com/dev"
    : "wss://ktufwkytp1.execute-api.us-east-1.amazonaws.com/prod";

const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000]; // Exponential backoff intervals (ms)

const Init: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const { socketConnection, isDataLoaded, messagesSent } = useAppSelector(
    (state) => state.app
  );
  const { initData } = useWebSocket({});
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const { locale, asPath } = router;
  const location = useLocation();

  const connectWebSocket = () => {
    const websocket = new WebSocket(WEBSOCKET_URL);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      dispatch(setSocketConnection(websocket));
    };

    setTimeout(() => {
      websocket.onclose = () => {
        console.log("WebSocket closed. Attempting to reconnect...");
        dispatch(setSocketConnection(null)); // Clear the connection state
        attemptReconnect();
      };
    }, 1000);

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      websocket.close(); // Force close to trigger reconnect logic
    };
  };

  const attemptReconnect = () => {
    if (reconnectAttempts < RECONNECT_INTERVALS.length) {
      const timeout = RECONNECT_INTERVALS[reconnectAttempts];
      setReconnectAttempts((prev) => prev + 1);
      setTimeout(() => connectWebSocket(), timeout);
    } else {
      console.error("Max reconnection attempts reached. Giving up.");
    }
  };

  useEffect(() => {
    if (!socketConnection) {
      connectWebSocket();
    }

    return () => socketConnection?.close(); // Cleanup on unmount
  }, [socketConnection]);

  useEffect(() => {
    if (!isDataLoaded && socketConnection) {
      initData(socketConnection);
      dispatch(setIsDataLoaded(true));
    }
  }, [socketConnection, isDataLoaded, dispatch]);

  useEffect(() => {
    if (auth?.isAuthenticated) dispatch(setIsDataLoaded(false));
  }, [auth?.isAuthenticated, dispatch]);

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      auth?.signinSilent();
    }
  }, []);

  useEffect(() => {
    if (locale && location.pathname !== asPath) {
      i18n.changeLanguage(locale);
      navigate(asPath, { replace: true });
    }
  }, [asPath, i18n, locale, location.pathname, navigate]);

  useEffect(() => {
    if (messagesSent === 2 && !auth.isAuthenticated)
      dispatch(toggleLoginModal());
  }, [auth.isAuthenticated, dispatch, messagesSent]);

  window.addEventListener("resize", () =>
    dispatch(setIsSmallScreen(window.innerWidth < 768))
  );
  return <></>;
};

export default Init;
