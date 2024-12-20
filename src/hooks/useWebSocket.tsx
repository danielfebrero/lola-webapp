import { useEffect, useRef } from "react";

import { useAppSelector } from "../store/hooks";

export default function useWebSocket(
  setThreadId?: (threadId: string) => void,
  setChatLog?: (
    chatLog: Message[] | ((prevState: Message[]) => Message[])
  ) => void
) {
  const socketConnection = useAppSelector(
    (state) => state.app.socketConnection
  );

  useEffect(() => {
    if (socketConnection) {
      socketConnection.onopen = () => {
        console.log("WebSocket connected");
      };

      socketConnection.onmessage = (event) => {
        console.log("Incoming message:", event.data);
        try {
          const data = JSON.parse(event.data);

          // Si un threadId est retourné par le serveur
          if (data.threadId && setThreadId) {
            setThreadId(data.threadId);
            return;
          }

          if (data.status === "done") {
            // La génération est terminée
            // On pourrait gérer ici une logique de fin
          } else if (data.error) {
            // Gérer les erreurs
            console.error("Error from server:", data.error);
          } else if (typeof data === "string" && setChatLog) {
            // data est un fragment de texte envoyé par l'assistant
            setChatLog((oldLog) => {
              // Si le dernier message est déjà du "narrator", on concatène
              if (
                oldLog.length > 0 &&
                oldLog[oldLog.length - 1].character === "narrator"
              ) {
                const updatedMsg = {
                  ...oldLog[oldLog.length - 1],
                  content: oldLog[oldLog.length - 1].content + data,
                };
                return [...oldLog.slice(0, -1), updatedMsg];
              } else {
                // Sinon on crée un nouveau message
                return [...oldLog, { character: "narrator", content: data }];
              }
            });
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message", event.data, err);
        }
      };

      socketConnection.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }
  }, []);

  const sendMessage = (
    message: string,
    endpoint: string,
    threadId: string | null
  ) => {
    // Ajoute le message de l'utilisateur dans le chat
    setChatLog &&
      setChatLog((oldLog) => [
        ...oldLog,
        { character: "user", content: message },
      ]);

    // Envoie l'action via WebSocket
    const msg: Record<string, any> = {
      action: "generateText",
      endpoint: endpoint,
      input_text: message,
    };

    if (threadId) {
      msg.threadId = threadId; // Ajoute le threadId s'il existe
    }

    socketConnection?.send(JSON.stringify(msg));
  };

  return { sendMessage };
}
