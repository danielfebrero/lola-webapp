import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "react-oidc-context";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useTranslation } from "react-i18next";

import ChevronDown from "../../icons/chevronDown";
import ModeDropdown from "../ModeDropdown";
import ProfileDropdown from "../ProfileDropdown";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import useGA from "../../hooks/useGA";
import ExploreLanguageDropdown from "../ExploreLanguageDropdown";
import { l } from "react-router/dist/development/fog-of-war-DU_DzpDb";
// import ShareIcon from "../../icons/share";

const languages = {
  all: "all languages",
  ar: "in Arabic",
  de: "in German",
  en: "in English",
  es: "in Spanish",
  fr: "in French",
  hi: "in Hindi",
  ja: "in Japanese",
  pt: "in Portuguese",
  ru: "in Russian",
  sv: "in Swedish",
  tr: "in Turkish",
  uk: "in Ukrainian",
  it: "in Italian",
};

const Header: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [exploreLanguageDropdownOpen, setExploreLanguageDropdownOpen] =
    useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("Main character");
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLeftPanelOpen, exploreLanguage } = useAppSelector(
    (state) => state.app
  );
  const newChatLocation = useNewChatLocation();
  const { sendEvent } = useGA();

  const toggleExploreLanguageDropdown = () => {
    setExploreLanguageDropdownOpen((prev) => !prev);
  };

  const toggleModeDropdown = () => {
    setModeDropdownOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (modeDropdownOpen) sendEvent("open_mode_dropdown");
  }, [modeDropdownOpen]);

  useEffect(() => {
    if (profileDropdownOpen) sendEvent("open_profile_dropdown");
  }, [profileDropdownOpen]);

  useEffect(() => {
    location.pathname.indexOf("/character/main") === 0
      ? setHeaderLabel("Main character")
      : location.pathname.indexOf("/character/new") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/character") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/game/new") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/game") === 0
      ? setHeaderLabel("You are the hero")
      : location.pathname.indexOf("/story/new") === 0
      ? setHeaderLabel("Story")
      : location.pathname.indexOf("/story") === 0
      ? setHeaderLabel("Story")
      : location.pathname.indexOf("/lola") === 0
      ? setHeaderLabel("Lola")
      : location.pathname.indexOf("/explore/best") === 0
      ? setHeaderLabel(t("Best content"))
      : location.pathname.indexOf("/explore/latest") === 0
      ? setHeaderLabel(t("Latest"))
      : setHeaderLabel("Story");
    setModeDropdownOpen(false);
  }, [location]);

  return (
    <div className="pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between items-center">
      <div className="w-auto h-auto">
        <div className="flex flex-row items-center">
          {!isLeftPanelOpen ? (
            <div className="flex flex-row text-textSecondary dark:text-darkTextSecondary">
              <div
                className="h-[24px] w-[24px] cursor-pointer mr-[10px]"
                onClick={() => dispatch(toggleLeftPanel())}
              >
                <PanelIcon />
              </div>
              <NavLink to={newChatLocation}>
                <div className="h-[24px] w-[24px]  mr-[10px]">
                  <NewChatIcon />
                </div>
              </NavLink>
            </div>
          ) : null}
          <div
            className="h-[40px] items-center flex flex-row text-textSecondary dark:text-darkTextSecondary cursor-pointer"
            onClick={toggleModeDropdown}
          >
            <span className="font-bold">{t(headerLabel)}</span>
            <div className="h-[24px] w-[24px]">
              <ChevronDown />
            </div>
          </div>
          {location.pathname.indexOf("/explore") === 0 && (
            <div
              className="h-[40px] items-center flex flex-row cursor-pointer ml-[10px]"
              onClick={toggleExploreLanguageDropdown}
            >
              <span className="font-bold">
                {t(languages[exploreLanguage as "fr"])}
              </span>
              <div className="h-[24px] w-[24px]">
                <ChevronDown />
              </div>
            </div>
          )}
        </div>
        <div className={clsx({ hidden: !modeDropdownOpen })}>
          <ModeDropdown hide={() => setModeDropdownOpen(false)} />
        </div>
        <div className={clsx({ hidden: !exploreLanguageDropdownOpen })}>
          <ExploreLanguageDropdown
            hide={() => setExploreLanguageDropdownOpen(false)}
          />
        </div>
      </div>
      <div className="flex flex-row">
        {/* {currentlyViewing.objectId &&
        currentlyViewing.objectType === "story" ? (
          <div>
            <button className="pl-[10px] pr-[10px] p-[5px] border border-borderColor rounded-full mr-[20px] hover:bg-lightGray">
              <div className="flex flex-row items-center">
                <div className="h-[20px] w-[20px] mr-[10px]">
                  <ShareIcon />
                </div>
                <span>{t("Share")}</span>
              </div>
            </button>
          </div>
        ) : null} */}
        <div
          className="bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer justify-center flex items-center"
          onClick={toggleProfileDropdown}
        >
          {auth?.isAuthenticated ? (
            auth.user?.profile.email?.substring(0, 1).toUpperCase()
          ) : (
            <div className="w-[20px] h-[20px]">
              <ChevronDown />
            </div>
          )}
        </div>
        <div className={clsx({ hidden: !profileDropdownOpen })}>
          <ProfileDropdown hide={() => setProfileDropdownOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Header;
