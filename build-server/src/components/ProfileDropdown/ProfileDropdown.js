import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import useClickOutside from "../../hooks/useClickOutside";
import LogoutIcon from "../../icons/logout";
import useGA from "../../hooks/useGA";
const ProfileDropdown = (props) => {
    const auth = useAuth();
    const { t } = useTranslation();
    const ref = useClickOutside(() => {
        props.hide();
    });
    const { sendEvent } = useGA();
    const signOutRedirect = () => {
        sendEvent("click_signout");
        const clientId = "6hg2ttnt7v00aflhj0qbgm0dgj";
        const logoutUri = window.location.origin;
        const cognitoDomain = "https://us-east-1ggrb4rlvb.auth.us-east-1.amazoncognito.com";
        auth.removeUser();
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };
    return (_jsx("div", { ref: ref, className: "rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[260px] right-[20px] mt-[40px]", children: auth.isAuthenticated ? (_jsxs("div", { className: "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row items-center", onClick: signOutRedirect, children: [_jsx("div", { className: "h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(LogoutIcon, {}) }), _jsx("div", { className: "ml-[10px]", children: t("Logout") })] })) : (_jsxs("div", { className: "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row items-center", onClick: () => {
                sendEvent("click_signin_signup");
                auth.signinRedirect();
            }, children: [_jsx("div", { className: "h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(LogoutIcon, {}) }), _jsx("div", { className: "ml-[10px]", children: t("Signup or login") })] })) }));
};
export default ProfileDropdown;
