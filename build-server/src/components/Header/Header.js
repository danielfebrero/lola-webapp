import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
// import ShareIcon from "../../icons/share";
const Header = () => {
    const { t } = useTranslation();
    const auth = useAuth();
    const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [headerLabel, setHeaderLabel] = useState("Main character");
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);
    const newChatLocation = useNewChatLocation();
    const { sendEvent } = useGA();
    const toggleModeDropdown = () => {
        setModeDropdownOpen((prev) => !prev);
    };
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen((prev) => !prev);
    };
    useEffect(() => {
        if (modeDropdownOpen)
            sendEvent("open_mode_dropdown");
    }, [modeDropdownOpen]);
    useEffect(() => {
        if (profileDropdownOpen)
            sendEvent("open_profile_dropdown");
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
                                        : setHeaderLabel("Story");
        setModeDropdownOpen(false);
    }, [location]);
    return (_jsxs("div", { className: "pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between items-center", children: [_jsxs("div", { className: "w-auto h-auto", children: [_jsxs("div", { className: "flex flex-row items-center", children: [!isLeftPanelOpen ? (_jsxs("div", { className: "flex flex-row text-textSecondary dark:text-darkTextSecondary", children: [_jsx("div", { className: "h-[24px] w-[24px] cursor-pointer mr-[10px]", onClick: () => dispatch(toggleLeftPanel()), children: _jsx(PanelIcon, {}) }), _jsx(NavLink, { to: newChatLocation, children: _jsx("div", { className: "h-[24px] w-[24px]  mr-[10px]", children: _jsx(NewChatIcon, {}) }) })] })) : null, _jsxs("div", { className: "h-[40px] items-center flex flex-row text-textSecondary dark:text-darkTextSecondary cursor-pointer", onClick: toggleModeDropdown, children: [_jsx("span", { className: "font-bold", children: t(headerLabel) }), _jsx("div", { className: "h-[24px] w-[24px]", children: _jsx(ChevronDown, {}) })] })] }), _jsx("div", { className: clsx({ hidden: !modeDropdownOpen }), children: _jsx(ModeDropdown, { hide: () => setModeDropdownOpen(false) }) })] }), _jsxs("div", { className: "flex flex-row", children: [_jsx("div", { className: "bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer", onClick: toggleProfileDropdown, children: auth.isAuthenticated
                            ? auth.user?.profile.email?.substring(0, 1).toUpperCase()
                            : null }), _jsx("div", { className: clsx({ hidden: !profileDropdownOpen }), children: _jsx(ProfileDropdown, { hide: () => setProfileDropdownOpen(false) }) })] })] }));
};
export default Header;
