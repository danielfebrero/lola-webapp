import { useAuth } from "react-oidc-context";

import useClickOutside from "../../hooks/useClickOutside";

import SettingsIcon from "../../icons/setting";
import LogoutIcon from "../../icons/logout";

import { useAppDispatch } from "../../store/hooks";
import { toggleSettings } from "../../store/features/app/appSlice";

interface ProfileDropdownProps {
  hide: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (props) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[260px] right-[20px] mt-[40px]"
    >
      <div
        className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
        onClick={() => dispatch(toggleSettings())}
      >
        <div className="h-[20px] w-[20px] text-textSecondary">
          <SettingsIcon />
        </div>
        <div className="ml-[10px]">Settings</div>
      </div>
      {auth.isAuthenticated ? (
        <div
          className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
          onClick={() => auth.removeUser()}
        >
          <div className="h-[20px] w-[20px] text-textSecondary">
            <LogoutIcon />
          </div>
          <div className="ml-[10px]">Logout</div>
        </div>
      ) : (
        <div
          className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
          onClick={() => auth.signinPopup()}
        >
          <div className="h-[20px] w-[20px] text-textSecondary">
            <LogoutIcon />
          </div>
          <div className="ml-[10px]">Login</div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
