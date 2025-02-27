import { useTranslation } from "react-i18next";

import useClickOutside from "../../hooks/useClickOutside";
import DeleteIcon from "../../icons/delete";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppDispatch } from "../../store/hooks";
import { setThread } from "../../store/features/app/appSlice";
import useGA from "../../hooks/useGA";
import useAPI from "../../hooks/useAPI";
import ArchiveIcon from "../../icons/archive";

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
  const { archiveThread } = useAPI();

  const clickOnDelete = () => {
    switch (props.type) {
      case "character":
        sendEvent("click_delete_char_from_left_panel", props.type);
        deleteCharacter(props.threadId);
        break;

      case "you_are_the_hero":
        sendEvent("click_delete_game_from_left_panel", props.type);
        deleteHeroGame(props.threadId);
        break;

      case "story":
        sendEvent("click_delete_story_from_left_panel", props.type);
        deleteStory(props.threadId);
        break;

      default:
        console.warn("Unhandled type:", props.type);
    }
    props.hide();
    dispatch(setThread({ threadId: props.threadId, isBeingDeleted: true }));
  };

  const clickOnArchive = () => {
    sendEvent("click_on_archive_from_left_panel", props.type);
    archiveThread(props.threadId);
    dispatch(setThread({ threadId: props.threadId, isBeingArchived: true }));
    props.hide();
  };

  return (
    <div
      ref={ref}
      className="w-auto h-auto p-[7px] flex flex-col rounded-lg border dark:border-darkBorderLight border-borderLight absolute bg-white dark:bg-darkMainSurfaceSecondary"
    >
      <div
        onClick={clickOnArchive}
        className="rounded-md w-full hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row items-center cursor-pointer"
      >
        <div className="h-[20px] w-[20px] mr-[10px]">
          <ArchiveIcon />
        </div>
        <span>{t("Archive")}</span>
      </div>
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
