import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";
const ModeDropdown = (props) => {
    const location = useLocation();
    const { t } = useTranslation();
    const ref = useClickOutside(() => {
        props.hide();
    });
    return (_jsxs("div", { ref: ref, className: "rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[320px]", children: [_jsx(NavLink, { to: location.pathname.indexOf("/character") === 0
                    ? location.pathname
                    : "/character/new", children: _jsxs("div", { className: "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { children: t("Character") }), _jsx("div", { className: "text-textSecondary dark:text-darkTextSecondary text-xs", children: t("Take care of your characters") })] }), location.pathname.indexOf("/character") === 0 && (_jsx("div", { className: "h-[20px] w-[20px]", children: _jsx(CheckIcon, {}) }))] }) }), _jsx(NavLink, { to: location.pathname.indexOf("/game") === 0 ? location.pathname : "/game", children: _jsxs("div", { className: "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { children: t("You are the hero") }), _jsx("div", { className: "text-textSecondary dark:text-darkTextSecondary text-xs", children: t("Play the game") })] }), location.pathname.indexOf("/game") === 0 && (_jsx("div", { className: "h-[20px] w-[20px]", children: _jsx(CheckIcon, {}) }))] }) }), _jsx(NavLink, { to: location.pathname.indexOf("/story") === 0
                    ? location.pathname
                    : "/story/new", children: _jsxs("div", { className: "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { children: t("Story") }), _jsx("div", { className: "text-textSecondary dark:text-darkTextSecondary text-xs", children: t("You are the author") })] }), location.pathname.indexOf("/story") === 0 && (_jsx("div", { className: "h-[20px] w-[20px]", children: _jsx(CheckIcon, {}) }))] }) }), _jsx(NavLink, { to: location.pathname.indexOf("/lola") === 0
                    ? location.pathname
                    : "/lola/new", children: _jsxs("div", { className: "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { children: "Lola" }), _jsx("div", { className: "text-textSecondary dark:text-darkTextSecondary text-xs", children: t("Chatbot without instructions") })] }), location.pathname.indexOf("/lola") === 0 && (_jsx("div", { className: "h-[20px] w-[20px]", children: _jsx(CheckIcon, {}) }))] }) })] }));
};
export default ModeDropdown;
