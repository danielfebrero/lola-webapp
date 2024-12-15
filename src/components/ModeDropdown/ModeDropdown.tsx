import { NavLink, useLocation } from "react-router";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";

interface ModeDropdownProps {
  hide: () => void;
}

const ModeDropdown: React.FC<ModeDropdownProps> = (props) => {
  const location = useLocation();

  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[320px]"
    >
      <NavLink
        to={
          location.pathname.indexOf("/character") == 0
            ? location.pathname
            : "/character/main"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Character</div>
            <div className="text-textSecondary text-xs">
              Take care of your characters
            </div>
          </div>
          {location.pathname.indexOf("/character") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/game") == 0 ? location.pathname : "/game"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>You are the hero</div>
            <div className="text-textSecondary text-xs">Play the game</div>
          </div>
          {location.pathname.indexOf("/game") == 0 && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      </NavLink>
      <NavLink
        to={
          location.pathname.indexOf("/story") == 0
            ? location.pathname
            : "/story/new"
        }
      >
        <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row justify-between items-center">
          <div>
            <div>Story</div>
            <div className="text-textSecondary text-xs">You are the author</div>
          </div>
          {location.pathname.indexOf("/story") == 0 && (
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
