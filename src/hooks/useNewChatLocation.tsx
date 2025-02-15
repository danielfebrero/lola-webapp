import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const useNewChatLocation = (): string => {
  const [newChatLocation, setNewChatLocation] = useState<string>("/story/new");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.indexOf("/character") === 0) {
      setNewChatLocation("/character/new");
    } else if (location.pathname.indexOf("/game") === 0) {
      setNewChatLocation("/game/new");
    } else if (location.pathname.indexOf("/story") === 0) {
      setNewChatLocation("/story/new");
    } else if (location.pathname.indexOf("/lola") === 0) {
      setNewChatLocation("/lola/new");
    } else if (location.pathname.indexOf("/explore/best") === 0) {
      setNewChatLocation("/lola/new");
    } else if (location.pathname.indexOf("/explore/latest/characters") === 0) {
      setNewChatLocation("/character/new");
    } else if (location.pathname.indexOf("/explore/latest/stories") === 0) {
      setNewChatLocation("/story/new");
    } else {
      setNewChatLocation("/story/new");
    }
  }, [location]);

  return newChatLocation;
};

export default useNewChatLocation;
