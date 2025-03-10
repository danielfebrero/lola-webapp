import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router";
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
import ShieldIcon from "../../icons/shield";
import { ALL_IN_LANGUAUES } from "../../utils/constants";
import { capitalizeFirstLetter } from "../../utils/string";
import LatestBestWorstDropdown from "../LatestBestWorstDropdown";

const languages = ALL_IN_LANGUAUES;

const Header: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const profileDropdownTriggerRef = useRef<HTMLDivElement>(null);
  const modeDropdownTriggerRef = useRef<HTMLDivElement>(null);
  const latestBestWorstDropdownTriggerRef = useRef<HTMLDivElement>(null);
  const exploreLanguageDropdownTriggerRef = useRef<HTMLDivElement>(null);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [exploreLanguageDropdownOpen, setExploreLanguageDropdownOpen] =
    useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [latestBestWorstDropdown, setLatestBestWorstDropdown] =
    useState<boolean>(false);
  const [headerLabel, setHeaderLabel] = useState<string>("Character");
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    isLeftPanelOpen,
    exploreLanguage,
    currentlyViewing,
    chatLogs,
    isSmallScreen,
  } = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.user);
  const newChatLocation = useNewChatLocation();
  const { sendEvent } = useGA();
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const params = useParams();

  const threadTitle = chatLogs.find(
    (log) => log.threadId === params.threadId
  )?.title;

  const toggleExploreLanguageDropdown = () => {
    setExploreLanguageDropdownOpen((prev) => !prev);
  };

  const toggleModeDropdown = () => {
    setModeDropdownOpen((prev) => !prev);
  };

  const toggleLatestBestWorstDropdown = () => {
    setLatestBestWorstDropdown((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (chatLogs.length > 0) {
      const currentThread = chatLogs.find(
        (log) => log.threadId === currentlyViewing.objectId
      );
      currentThread
        ? setIsPrivate(currentThread.is_private ?? false)
        : setIsPrivate(false);
    } else {
      setIsPrivate(false);
    }
  }, [currentlyViewing, chatLogs]);

  useEffect(() => {
    if (modeDropdownOpen) sendEvent("open_mode_dropdown", "header");
  }, [modeDropdownOpen]);

  useEffect(() => {
    if (profileDropdownOpen) sendEvent("open_profile_dropdown", "header");
  }, [profileDropdownOpen]);

  useEffect(() => {
    location.pathname.indexOf("/character") === 0
      ? setHeaderLabel("Character")
      : location.pathname.indexOf("/game") === 0
      ? setHeaderLabel(isSmallScreen ? "CYOA" : "You are the hero")
      : location.pathname.indexOf("/story") === 0
      ? setHeaderLabel("Story")
      : location.pathname.indexOf("/lola") === 0
      ? setHeaderLabel("Lola")
      : location.pathname.indexOf("/explore/characters") === 0
      ? setHeaderLabel(t("Characters"))
      : location.pathname.indexOf("/explore/stories") === 0
      ? setHeaderLabel(t("Stories"))
      : location.pathname.indexOf("/explore/images") === 0
      ? setHeaderLabel(t("Images"))
      : location.pathname.indexOf("/images") === 0
      ? setHeaderLabel(t("My images"))
      : location.pathname.indexOf("/pricing") === 0
      ? setHeaderLabel(t("Pricing"))
      : location.pathname.indexOf("/analytics") === 0
      ? setHeaderLabel(t("Analytics"))
      : location.pathname.indexOf("/checkout") === 0
      ? setHeaderLabel(t("Checkout"))
      : location.pathname.indexOf("/archived") === 0
      ? setHeaderLabel(t("Archived"))
      : location.pathname.indexOf("/social/chat") === 0
      ? setHeaderLabel(t("Chat"))
      : setHeaderLabel("Story");
    setModeDropdownOpen(false);
  }, [location, isSmallScreen]);

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
            ref={modeDropdownTriggerRef}
          >
            <span className="font-bold">{t(headerLabel)}</span>
            <div className="h-[24px] w-[24px]">
              <ChevronDown />
            </div>
          </div>
          {isPrivate &&
            (location.pathname.indexOf("/story") === 0 ||
              location.pathname.indexOf("/character") === 0) && (
              <div className="ml-2 flex flex-row items-center">
                <div>{t("Private")}</div>
                <div className="w-[18px] h-[18px] ml-1">
                  <ShieldIcon />
                </div>
              </div>
            )}
          {location.pathname.indexOf("/explore") === 0 &&
            location.pathname.indexOf("/explore/images") === -1 && (
              <>
                <div
                  className="h-[40px] items-center flex flex-row cursor-pointer ml-[10px]"
                  onClick={toggleLatestBestWorstDropdown}
                  ref={latestBestWorstDropdownTriggerRef}
                >
                  <span className="font-bold">
                    {t(
                      ["latest", "best", "worst"].includes(
                        params.exploreMode ?? ""
                      )
                        ? capitalizeFirstLetter(params.exploreMode ?? "Latest")
                        : "Latest"
                    )}
                  </span>
                  <div className="h-[24px] w-[24px]">
                    <ChevronDown />
                  </div>
                </div>
                {!isSmallScreen && (
                  <div
                    className="h-[40px] items-center flex flex-row cursor-pointer ml-[10px]"
                    onClick={toggleExploreLanguageDropdown}
                    ref={exploreLanguageDropdownTriggerRef}
                  >
                    <span className="font-bold">
                      {t(languages[exploreLanguage as "fr"])}
                    </span>
                    <div className="h-[24px] w-[24px]">
                      <ChevronDown />
                    </div>
                  </div>
                )}
              </>
            )}
          {params.threadId && (
            <div className="h-[40px] items-center flex flex-row ml-[10px]">
              <span className="font-bold">{t(threadTitle)}</span>
            </div>
          )}
        </div>
        <div className={clsx({ hidden: !modeDropdownOpen })}>
          <ModeDropdown
            hide={() => setModeDropdownOpen(false)}
            triggerRef={modeDropdownTriggerRef}
          />
        </div>
        <div className={clsx({ hidden: !exploreLanguageDropdownOpen })}>
          <ExploreLanguageDropdown
            hide={() => setExploreLanguageDropdownOpen(false)}
            triggerRef={exploreLanguageDropdownTriggerRef}
          />
        </div>
        <div className={clsx({ hidden: !latestBestWorstDropdown })}>
          <LatestBestWorstDropdown
            hide={() => setLatestBestWorstDropdown(false)}
            triggerRef={latestBestWorstDropdownTriggerRef}
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div
          className="bg-brandMainColor dark:bg-darkBrandMainColor hover:bg-brandMainColorHover dark:hover:bg-darkBrandMainColorHover rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer justify-center flex items-center overflow-hidden"
          onClick={toggleProfileDropdown}
          ref={profileDropdownTriggerRef}
        >
          {auth?.isAuthenticated && !user.settings.profile_picture ? (
            auth.user?.profile.email?.substring(0, 1).toUpperCase()
          ) : auth?.isAuthenticated && user.settings.profile_picture ? (
            <img
              src={user.settings.profile_picture?.large}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-[20px] h-[20px]">
              <ChevronDown />
            </div>
          )}
        </div>
        <div className={clsx({ hidden: !profileDropdownOpen })}>
          <ProfileDropdown
            hide={() => setProfileDropdownOpen(false)}
            triggerRef={profileDropdownTriggerRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
