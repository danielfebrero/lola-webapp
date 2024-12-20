import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSocketConnection } from "../../store/features/app/appSlice";
import { setIsDataLoaded } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

const WEBSOCKET_URL =
  "wss://v7uxhpktv5.execute-api.us-east-1.amazonaws.com/dev";

const Init: React.FC = () => {
  const dispatch = useAppDispatch();
  const { socketConnection, isDataLoaded } = useAppSelector(
    (state) => state.app
  );
  const { initData } = useWebSocket({});

  useEffect(() => {
    if (socketConnection === null) {
      const websocket = new WebSocket(WEBSOCKET_URL);
      dispatch(setSocketConnection(websocket));
    }
  }, [socketConnection]);

  useEffect(() => {
    if (socketConnection && !isDataLoaded) {
      initData();
      setIsDataLoaded(true);
    }
  }, [socketConnection, isDataLoaded]);

  useEffect(() => {
    return () => socketConnection?.close();
  }, []);

  return <></>;
};

export default Init;
