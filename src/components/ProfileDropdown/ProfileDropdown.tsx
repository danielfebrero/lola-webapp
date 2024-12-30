import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";

import useClickOutside from "../../hooks/useClickOutside";
import LogoutIcon from "../../icons/logout";

interface ProfileDropdownProps {
  hide: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = (props) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const ref = useClickOutside(() => {
    props.hide();
  });

  const signOutRedirect = () => {
    const clientId = "6hg2ttnt7v00aflhj0qbgm0dgj";
    const logoutUri = window.location.origin;
    const cognitoDomain =
      "https://us-east-1ggrb4rlvb.auth.us-east-1.amazoncognito.com";
    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  return (
    <div
      ref={ref}
      className="rounded-lg border border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white min-w-[260px] right-[20px] mt-[40px]"
    >
      {/* <div
        className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
        onClick={() => dispatch(toggleSettings())}
      >
        <div className="h-[20px] w-[20px] text-textSecondary">
          <SettingsIcon />
        </div>
        <div className="ml-[10px]">Settings</div>
      </div> */}
      {auth.isAuthenticated ? (
        <div
          className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
          onClick={signOutRedirect}
        >
          <div className="h-[20px] w-[20px] text-textSecondary">
            <LogoutIcon />
          </div>
          <div className="ml-[10px]">{t("Logout")}</div>
        </div>
      ) : (
        <div
          className="cursor-pointer hover:bg-lightGray p-[10px] flex flex-row items-center"
          onClick={() => auth.signinRedirect()}
        >
          <div className="h-[20px] w-[20px] text-textSecondary">
            <LogoutIcon />
          </div>
          <div className="ml-[10px]">{t("Signup or login")}</div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
