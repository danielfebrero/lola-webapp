import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import ChevronDown from "../../icons/chevronDown";
import ModeDropdown from "../ModeDropdown";
import ProfileDropdown from "../ProfileDropdown";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import ShareIcon from "../../icons/share";

const Header: React.FC = () => {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [headerLabel, setHeaderLabel] = useState("Main character");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);
  const currentlyViewing = useAppSelector(
    (state) => state.app.currentlyViewing
  );
  const newChatLocation = useNewChatLocation();

  const toggleModeDropdown = () => {
    setModeDropdownOpen(!modeDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

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
      : setHeaderLabel("Story");
    setModeDropdownOpen(false);
  }, [location]);

  return (
    <div className="pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between">
      <div className="w-auto h-auto">
        <div className="flex flex-row items-center">
          {!isLeftPanelOpen ? (
            <div className="flex flex-row text-textSecondary">
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
            className="h-[40px] items-center flex flex-row text-textSecondary cursor-pointer"
            onClick={toggleModeDropdown}
          >
            <span className="font-bold">{headerLabel}</span>
            <div className="h-[24px] w-[24px]">
              <ChevronDown />
            </div>
          </div>
        </div>
        <div className={clsx({ hidden: !modeDropdownOpen })}>
          <ModeDropdown hide={() => setModeDropdownOpen(false)} />
        </div>
      </div>
      <div className="flex flex-row">
        {currentlyViewing.objectId &&
        currentlyViewing.objectType === "story" ? (
          <div>
            <button className="pl-[10px] pr-[10px] p-[5px] border border-borderColor rounded-full mr-[10px] hover:bg-lightGray">
              <div className="flex flex-row items-center">
                <div className="h-[20px] w-[20px] mr-[10px]">
                  <ShareIcon />
                </div>
                <span>Share</span>
              </div>
            </button>
          </div>
        ) : null}
        <div
          className="bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer"
          onClick={toggleProfileDropdown}
        >
          D
        </div>
        <div className={clsx({ hidden: !profileDropdownOpen })}>
          <ProfileDropdown hide={() => setProfileDropdownOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Header;
