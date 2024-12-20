import { useEffect, useRef, useState } from "react";

interface Message {
  character: string;
  content: string;
}

interface UseWebSocketOptions {
  endpoint: string;
}

const WEBSOCKET_URL =
  "wss://mzl7im2d11.execute-api.us-east-1.amazonaws.com/dev";

export default function useWebSocket({ endpoint }: UseWebSocketOptions) {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      console.log("Incoming message:", event.data);
      try {
        const data = JSON.parse(event.data);

        // Si un threadId est retourné par le serveur
        if (data.threadId) {
          setThreadId(data.threadId);
          // On peut retourner car ce message ne contient potentiellement pas de contenu
          return;
        }

        if (data.status === "done") {
          // La génération est terminée
          // On pourrait gérer ici une logique de fin
        } else if (data.error) {
          // Gérer les erreurs
          console.error("Error from server:", data.error);
        } else if (typeof data === "string") {
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

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [endpoint]);

  const sendMessage = (message: string) => {
    // Ajoute le message de l'utilisateur dans le chat
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

    wsRef.current?.send(JSON.stringify(msg));
  };

  return { chatLog, sendMessage };
}
