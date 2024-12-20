import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSocketConnection } from "../../store/features/app/appSlice";

const WEBSOCKET_URL =
  "wss://q0inpoefsg.execute-api.us-east-1.amazonaws.com/dev";

const InitSocket: React.FC = () => {
  const dispatch = useAppDispatch();
  const socketConnection = useAppSelector(
    (state) => state.app.socketConnection
  );

  useEffect(() => {
    if (socketConnection === null) {
      const websocket = new WebSocket(WEBSOCKET_URL);
      dispatch(setSocketConnection(websocket));
    }
  }, [socketConnection]);

  useEffect(() => {
    return () => socketConnection?.close();
  }, []);

  return <></>;
};

export default InitSocket;
