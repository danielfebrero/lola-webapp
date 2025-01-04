import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import GuardIcon from "../../icons/guard";
import MembershipIcon from "../../icons/membership";
import PersonalizationIcon from "../../icons/personalization";
import { toggleSettings } from "../../store/features/app/appSlice";
const Settings = () => {
    const isSettingsOpen = useAppSelector((state) => state.app.isSettingsOpen);
    const dispatch = useAppDispatch();
    const [selectedView, setSelectedView] = useState("personalization");
    const [showChangeMyPassword, setShowChangeMyPassword] = useState(false);
    return (_jsxs("div", { className: clsx({ hidden: !isSettingsOpen }, "bg-white dark:bg-darkMainSurfaceSecondary rounded-lg py-5 w-[680px]"), children: [_jsxs("div", { className: "flex justify-between items-center pb-5 px-5 border-b border-borderBlack", children: [_jsx("div", { className: "text-lg font-semibold", children: "Settings" }), _jsx("div", { onClick: () => dispatch(toggleSettings()), className: "h-[18px] w-[18px] cursor-pointer", children: _jsx(CloseIcon, {}) })] }), _jsxs("div", { className: "flex flex-row", children: [_jsxs("div", { className: "flex flex-col p-[10px]", children: [_jsxs("div", { className: clsx({
                                    "bg-lightGray dark:bg-darkLightGray": selectedView === "personalization",
                                }, "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"), onClick: () => setSelectedView("personalization"), children: [_jsx("div", { className: "h-[16px] w-[16px] mr-2", children: _jsx(PersonalizationIcon, {}) }), _jsx("div", { children: "Personalization" })] }), _jsxs("div", { className: clsx({
                                    "bg-lightGray dark:bg-darkLightGray": selectedView === "account",
                                }, "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"), onClick: () => setSelectedView("account"), children: [_jsx("div", { className: "h-[16px] w-[16px] mr-2", children: _jsx(GuardIcon, {}) }), _jsx("div", { children: "Account" })] }), _jsxs("div", { className: clsx({
                                    "bg-lightGray dark:bg-darkLightGray": selectedView === "membership",
                                }, "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"), onClick: () => setSelectedView("membership"), children: [_jsx("div", { className: "h-[16px] w-[16px] mr-2", children: _jsx(MembershipIcon, {}) }), _jsx("div", { children: "Membership" })] })] }), _jsx("div", { className: "p-[20px] w-full", children: selectedView === "account" ? (_jsxs(_Fragment, { children: [_jsx("div", { className: clsx({ hidden: showChangeMyPassword }, "cursor-pointer hover:underline"), onClick: () => setShowChangeMyPassword(true), children: "Change my password" }), _jsxs("div", { className: clsx({ hidden: !showChangeMyPassword }, "flex flex-col"), children: [_jsx("input", { type: "password", placeholder: "Current password", className: "outline-none p-[5px] mb-[10px]" }), _jsx("input", { type: "password", placeholder: "New password", className: "outline-none p-[5px] mb-[10px]" }), _jsx("input", { type: "password", placeholder: "Confirm password", className: "outline-none p-[5px] mb-[10px]" }), _jsxs("div", { className: "flex justify-end w-full", children: [_jsx("div", { className: "cursor-pointer mr-[20px] hover:bg-lightGray dark:hover:bg-darkLightGray rounded-lg pl-[20px] pr-[20px] p-[5px]", onClick: () => setShowChangeMyPassword(false), children: "Change" }), _jsx("div", { className: "cursor-pointer mr-[10px] hover:bg-lightGray dark:hover:bg-darkLightGray rounded-lg pl-[20px] pr-[20px] p-[5px]", onClick: () => setShowChangeMyPassword(false), children: "Cancel" })] })] })] })) : selectedView === "membership" ? (_jsx(_Fragment, {})) : selectedView === "personalization" ? (_jsx(_Fragment, {})) : null })] })] }));
};
export default Settings;
