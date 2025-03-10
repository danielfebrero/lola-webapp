import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";

const useNewChatLocation = (): string => {
  const { currentlyViewing } = useAppSelector((state) => state.app);
  const [newChatLocation, setNewChatLocation] = useState<string>("/lola/new");

  useEffect(() => {
    setNewChatLocation(
      currentlyViewing.objectType === "character"
        ? "/character/new"
        : currentlyViewing.objectType === "game"
        ? "/game/new"
        : currentlyViewing.objectType === "story"
        ? "/story/new"
        : currentlyViewing.objectType === "lola"
        ? "/lola/new"
        : currentlyViewing.objectType === "chat_group"
        ? "/social/chat/new"
        : "/lola/new"
    );
  }, [currentlyViewing]);

  return newChatLocation;
};

export default useNewChatLocation;
