import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useNewChatLocation = (): string => {
  const [newChatLocation, setNewChatLocation] = useState<string>("/story/new");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("character")) {
      setNewChatLocation("/character/new");
    } else if (location.pathname.includes("game")) {
      setNewChatLocation("/game/new");
    } else if (location.pathname.includes("story")) {
      setNewChatLocation("/story/new");
    } else {
      setNewChatLocation("/story/new");
    }
  }, [location]);

  return newChatLocation;
};

export default useNewChatLocation;
