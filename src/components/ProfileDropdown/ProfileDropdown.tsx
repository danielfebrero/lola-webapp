import useClickOutside from "../../hooks/useClickOutside";

import SettingsIcon from "../../icons/setting";
import LogoutIcon from "../../icons/logout";

interface ProfileDropdownProps {
  hide: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (props) => {
  const ref = useClickOutside(() => {
    props.hide();
  });

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[260px] right-[20px] mt-[10px]"
    >
      <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center">
        <div className="h-[20px] w-[20px] text-textSecondary">
          <SettingsIcon />
        </div>
        <div className="ml-[10px]">Settings</div>
      </div>
      <div className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center">
        <div className="h-[20px] w-[20px] text-textSecondary">
          <LogoutIcon />
        </div>
        <div className="ml-[10px]">Logout</div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
