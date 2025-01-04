import { useTranslation } from "react-i18next";

import useClickOutside from "../../hooks/useClickOutside";
import DeleteIcon from "../../icons/delete";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppDispatch } from "../../store/hooks";
import { setChatLog } from "../../store/features/app/appSlice";
import useGA from "../../hooks/useGA";

interface OptionsDropdownProps {
  hide: () => void;
  threadId: string;
  type: string;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = (props) => {
  const { t } = useTranslation();
  const ref = useClickOutside(() => {
    props.hide();
  });
  const { deleteCharacter, deleteHeroGame, deleteStory } = useWebSocket({});
  const dispatch = useAppDispatch();
  const { sendEvent } = useGA();

  const clickOnDelete = () => {
    switch (props.type) {
      case "character":
        sendEvent("click_delete_char_from_left_panel");
        deleteCharacter(props.threadId);
        break;

      case "you_are_the_hero":
        sendEvent("click_delete_game_from_left_panel");
        deleteHeroGame(props.threadId);
        break;

      case "story":
        sendEvent("click_delete_story_from_left_panel");
        deleteStory(props.threadId);
        break;

      default:
        console.warn("Unhandled type:", props.type);
    }
    props.hide();
    dispatch(setChatLog({ threadId: props.threadId, isBeingDeleted: true }));
  };

  return (
    <div
      ref={ref}
      className="w-auto h-auto p-[7px] flex flex-col rounded-lg border dark:border-darkBorderLight border-borderLight absolute bg-white dark:bg-darkMainSurfaceSecondary"
    >
      <div
        onClick={clickOnDelete}
        className="rounded-md w-full hover:bg-lightGray dark:hover:bg-darkLightGray p-[10px] flex flex-row items-center cursor-pointer text-textError"
      >
        <div className="h-[20px] w-[20px] mr-[10px]">
          <DeleteIcon />
        </div>
        <span>{t("Delete")}</span>
      </div>
    </div>
  );
};

export default OptionsDropdown;
