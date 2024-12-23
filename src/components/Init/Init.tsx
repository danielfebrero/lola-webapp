import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setSocketConnection,
  setIsDataLoaded,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

const WEBSOCKET_URL =
  "wss://hohowdv45h.execute-api.us-east-1.amazonaws.com/dev";

const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000]; // Exponential backoff intervals (ms)

const Init: React.FC = () => {
  const dispatch = useAppDispatch();
  const { socketConnection, isDataLoaded } = useAppSelector(
    (state) => state.app
  );
  const { initData } = useWebSocket({});
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connectWebSocket = () => {
    const websocket = new WebSocket(WEBSOCKET_URL);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      dispatch(setSocketConnection(websocket));
      setTimeout(() => {
        if (!isDataLoaded) {
          initData(websocket);
          dispatch(setIsDataLoaded(true));
        }
      }, 150);
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

  return <></>;
};

export default Init;
