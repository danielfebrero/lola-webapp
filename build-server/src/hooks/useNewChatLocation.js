import { useEffect, useState } from "react";
import { useLocation } from "react-router";
const useNewChatLocation = () => {
    const [newChatLocation, setNewChatLocation] = useState("/story/new");
    const location = useLocation();
    useEffect(() => {
        if (location.pathname.indexOf("/character") === 0) {
            setNewChatLocation("/character/new");
        }
        else if (location.pathname.indexOf("/game") === 0) {
            setNewChatLocation("/game/new");
        }
        else if (location.pathname.indexOf("/story") === 0) {
            setNewChatLocation("/story/new");
        }
        else if (location.pathname.indexOf("/lola") === 0) {
            setNewChatLocation("/lola/new");
        }
        else {
            setNewChatLocation("/story/new");
        }
    }, [location]);
    return newChatLocation;
};
export default useNewChatLocation;
