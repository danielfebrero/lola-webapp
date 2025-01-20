import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";
import { useUserLog } from "@userlog/next";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setIsDataLoaded,
  setIsSmallScreen,
  toggleLoginModal,
  setPrevMode,
  setIsDataLoading,
  setIsDataLoadingLeftPanel,
  setLanguages,
} from "../../store/features/app/appSlice";
import { setSocketConnection } from "../../store/features/socket/socketSlice";
import useWebSocket from "../../hooks/useWebSocket";

const WEBSOCKET_URL =
  process.env.NODE_ENV === "development" ||
  window.location.origin !== "https://lola.la"
    ? "wss://6nk800sp9d.execute-api.us-east-1.amazonaws.com/dev"
    : "wss://ktufwkytp1.execute-api.us-east-1.amazonaws.com/prod";

const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000]; // Exponential backoff intervals (ms)

const Init: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const {
    isDataLoaded,
    messagesSent,
    isSmallScreen,
    mode,
    prevMode,
    isDataLoading,
  } = useAppSelector((state) => state.app);
  const { socketConnection } = useAppSelector((state) => state.socket);
  const { setUserId } = useUserLog();
  const { settings } = useAppSelector((state) => state.user);
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
    dispatch(
      setLanguages({
        ar: "العربية",
        de: "Deutsch",
        en: "English",
        es: "Español",
        fr: "Français",
        hi: "हिन्दी",
        it: "Italiano",
        ja: "日本語",
        pt: "Português",
        ru: "Русский",
        sv: "Svenska",
        tr: "Türkçe",
        uk: "Українська",
      })
    );
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setIsDataLoadingLeftPanel(isDataLoading));
    }, 600);
  }, [isDataLoading]);

  useEffect(() => {
    if (prevMode !== mode && location.pathname !== "/18") {
      dispatch(setPrevMode(mode));
      dispatch(setIsDataLoaded(false));
      dispatch(setIsDataLoading(["characters", "threads", "settings"]));
      dispatch(
        setIsDataLoadingLeftPanel(["characters", "threads", "settings"])
      );
      navigate("/");
    }
  }, [mode, prevMode, location.pathname]);

  useEffect(() => {
    if (!socketConnection) {
      connectWebSocket();
    }

    return () => socketConnection?.close(); // Cleanup on unmount
  }, [socketConnection]);

  useEffect(() => {
    if (
      !isDataLoaded &&
      socketConnection &&
      socketConnection.readyState === socketConnection.OPEN
    ) {
      initData();
      dispatch(setIsDataLoaded(true));
    }
  }, [socketConnection, isDataLoaded, dispatch]);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      dispatch(setIsDataLoaded(false));
      setUserId(auth.user?.profile?.email ?? "auth_user_no_email");
    }
  }, [auth?.isAuthenticated, dispatch]);

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      auth?.signinSilent();
    }
  }, []);

  useEffect(() => {
    if (settings.language === "auto") return;
    else i18n.changeLanguage(settings.language);
  }, [settings.language]);

  useEffect(() => {
    if (
      locale &&
      location.pathname !== asPath &&
      settings.language === "auto" &&
      location.pathname !== "/login/success" &&
      location.pathname.substring(1, 3) === locale
    ) {
      i18n.changeLanguage(locale);
      navigate(asPath, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (messagesSent === 2 && !auth.isAuthenticated && !isSmallScreen)
      dispatch(toggleLoginModal());
  }, [auth.isAuthenticated, dispatch, messagesSent]);

  window.addEventListener("resize", () =>
    dispatch(setIsSmallScreen(window.innerWidth < 768))
  );
  return <></>;
};

export default Init;
