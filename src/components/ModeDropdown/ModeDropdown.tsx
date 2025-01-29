import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";

interface ModeDropdownProps {
  hide: () => void;
}

const ModeDropdown: React.FC<ModeDropdownProps> = (props) => {
  const location = useLocation();
  const { t } = useTranslation();

  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[320px]"
    >
      <NavLink
        to={
          location.pathname.indexOf("/character") === 0
            ? location.pathname
            : "/character/new"
        }
      >
        <div className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>{t("Character")}</div>
            <div className="text-textSecondary dark:text-darkTextSecondary text-xs">
              {t("Take care of your characters")}
            </div>
          </div>
          {location.pathname.indexOf("/character") === 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/story") === 0
            ? location.pathname
            : "/story/new"
        }
      >
        <div className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>{t("Story")}</div>
            <div className="text-textSecondary dark:text-darkTextSecondary text-xs">
              {t("You are the author")}
            </div>
          </div>
          {location.pathname.indexOf("/story") === 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/game") === 0 ? location.pathname : "/game"
        }
      >
        <div className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>{t("You are the hero")}</div>
            <div className="text-textSecondary dark:text-darkTextSecondary text-xs">
              {t("Play the game")}
            </div>
          </div>
          {location.pathname.indexOf("/game") === 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/lola") === 0
            ? location.pathname
            : "/lola/new"
        }
      >
        <div className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Lola</div>
            <div className="text-textSecondary dark:text-darkTextSecondary text-xs">
              {t("Chatbot without instructions")}
            </div>
          </div>
          {location.pathname.indexOf("/lola") === 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default ModeDropdown;
