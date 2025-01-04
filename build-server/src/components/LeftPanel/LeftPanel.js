import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import OptionsIcon from "../../icons/options";
import PlusIcon from "../../icons/plus";
import LoadingIcon from "../../icons/loading";
import imageDani from "../../images/dani.webp";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import OptionsDropdown from "../OptionsDropdown";
import useClickOutside from "../../hooks/useClickOutside";
import useGA from "../../hooks/useGA";
const LeftPanel = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [displayOptionDropdownId, setDisplayOptionDropdownId] = useState(null);
    const [clickedElement, setClickedElement] = useState(null);
    const newChatLocation = useNewChatLocation();
    const { isLeftPanelOpen, chatLogs, characters, isSmallScreen } = useAppSelector((state) => state.app);
    const { sendEvent } = useGA();
    const outsideRef = useClickOutside(() => isLeftPanelOpen && isSmallScreen ? dispatch(toggleLeftPanel()) : null);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const scrollRef = useRef(null);
    const handleDropdownClick = (event, threadId) => {
        const domRect = event.currentTarget.getBoundingClientRect();
        setClickedElement(domRect);
        const scrollContainer = scrollRef.current?.getBoundingClientRect();
        if (scrollContainer) {
            setDropdownPosition({
                top: (domRect?.top ?? 0) - scrollContainer.top + 70,
                left: (domRect?.left ?? 0) -
                    scrollContainer.left +
                    scrollRef.current.scrollLeft +
                    30,
            });
        }
        setDisplayOptionDropdownId(threadId);
    };
    useEffect(() => {
        const handleScroll = () => {
            if (displayOptionDropdownId && dropdownPosition && scrollRef.current) {
                setDisplayOptionDropdownId(null);
            }
        };
        const scrollContainer = scrollRef.current;
        scrollContainer?.addEventListener("scroll", handleScroll);
        return () => {
            scrollContainer?.removeEventListener("scroll", handleScroll);
        };
    }, [
        clickedElement,
        displayOptionDropdownId,
        dropdownPosition,
        setDropdownPosition,
    ]);
    return (_jsx("div", { ref: outsideRef, className: clsx({
            "min-w-[260px] w-[260px]": isLeftPanelOpen,
            "min-w-0 w-0": !isLeftPanelOpen,
        }, `transition-all duration-500 h-screen bg-lightGray dark:bg-darkLightGray`), children: _jsxs("div", { className: "h-screen w-[260px] flex flex-col pl-[20px] pr-[20px] pt-[10px]", children: [_jsx("div", { className: "h-auto w-full flex flex-col", children: _jsxs("div", { className: "font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary dark:text-darkTextSecondary", children: [_jsx("div", { className: "h-[24px] w-[24px] cursor-pointer", onClick: () => {
                                    dispatch(toggleLeftPanel());
                                    sendEvent("click_toggle_left_panel");
                                }, children: _jsx(PanelIcon, {}) }), _jsx(NavLink, { to: newChatLocation, onClick: () => {
                                    if (isSmallScreen && isLeftPanelOpen)
                                        dispatch(toggleLeftPanel());
                                    sendEvent("click_new_chat_from_left_panel");
                                }, children: _jsx("div", { className: "h-[24px] w-[24px]", children: _jsx(NewChatIcon, {}) }) })] }) }), _jsxs("div", { ref: scrollRef, className: "h-auto w-[calc(100%+20px)] flex flex-col overflow-y-scroll overflow-x-clip pb-[20px] ml-[-10px] mr-[-10px] no-scrollbar", children: [_jsxs("div", { className: "h-auto w-full flex flex-col ml-[10px] pr-[20px]", children: [_jsxs("div", { className: "font-bold h-[40px] content-center flex flex-row justify-between items-center", children: [_jsx("div", { children: t("Characters") }), chatLogs.filter((log) => log.type === "character").length > 0 ? (_jsx(NavLink, { to: "/character/new", onClick: () => {
                                                if (isSmallScreen && isLeftPanelOpen)
                                                    dispatch(toggleLeftPanel());
                                                sendEvent("click_plus_char_from_left_panel");
                                            }, children: _jsx("div", { className: "w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(PlusIcon, {}) }) })) : null] }), chatLogs.filter((log) => log.type === "character").length === 0 ? (_jsx(NavLink, { to: "/character/new", onClick: isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined, children: _jsxs("div", { className: "flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]", children: [_jsx("div", { className: "h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(PlusIcon, {}) }), _jsx("span", { className: "pl-[10px]", children: t("New character") })] }) })) : (chatLogs
                                    .filter((log) => log.type === "character")
                                    .map((char) => (_jsxs("div", { className: "group flex flex-row items-center h-[40px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] justify-between", children: [_jsx(NavLink, { className: "h-full grow flex items-center w-[calc(100%-40px)]", onClick: isSmallScreen
                                                ? () => dispatch(toggleLeftPanel())
                                                : undefined, to: char.type === "main"
                                                ? "/character/main"
                                                : `/character/${char.threadId}`, children: _jsxs("div", { className: "flex flex-row", children: [_jsxs("div", { className: clsx({
                                                            "bg-gray-200 rounded-full": characters.find((c) => c.threadId === char.threadId)?.images?.[0] === undefined,
                                                        }, "h-[24px] w-[24px]"), children: [" ", characters.find((c) => c.threadId === char.threadId)
                                                                ?.imagesMultisize?.[0] ? (_jsx("img", { src: characters.find((c) => c.threadId === char.threadId)?.imagesMultisize?.[0]?.small, className: "rounded-full h-[24px] w-[24px] object-cover" })) : characters.find((c) => c.threadId === char.threadId)?.images?.[0] ? (_jsx("img", { src: characters.find((c) => c.threadId === char.threadId)?.imagesMultisize?.[0]?.small ??
                                                                    characters.find((c) => c.threadId === char.threadId)?.images?.[0] ??
                                                                    imageDani, className: "rounded-full h-[24px] w-[24px] object-cover" })) : null] }), _jsx("span", { className: "pl-[10px] truncate", children: t(characters.find((c) => c.threadId === char.threadId)
                                                            ?.json?.name ??
                                                            char.title ??
                                                            "") })] }) }, char.threadId), char.isBeingDeleted ? (_jsx("div", { className: "h-[24px] w-[24px] text-textSecondar dark:text-darkTextSecondary", children: _jsx(LoadingIcon, {}) })) : (_jsx("div", { className: clsx({
                                                hidden: displayOptionDropdownId !== char.threadId,
                                            }, "group-hover:block cursor-pointer ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"), onClick: (event) => handleDropdownClick(event, char.threadId), children: _jsx(OptionsIcon, {}) })), displayOptionDropdownId === char.threadId &&
                                            dropdownPosition && (_jsx("div", { style: {
                                                // position: "fixed",
                                                top: dropdownPosition.top,
                                                left: dropdownPosition.left,
                                            }, className: "z-20 absolute", children: _jsx(OptionsDropdown, { type: "character", threadId: char.threadId, hide: () => setDisplayOptionDropdownId(null) }) }))] }))))] }), _jsxs("div", { className: "h-auto w-full flex flex-col ml-[10px] pr-[20px]", children: [_jsxs("div", { className: "font-bold h-[40px] content-center flex flex-row justify-between items-center", children: [_jsx("div", { className: "font-bold h-[40px] content-center", children: t("Games") }), chatLogs.filter((log) => log.type === "you_are_the_hero")
                                            .length > 0 ? (_jsx(NavLink, { to: "/game/new", onClick: () => {
                                                if (isSmallScreen && isLeftPanelOpen)
                                                    dispatch(toggleLeftPanel());
                                                sendEvent("click_plus_game_from_left_panel");
                                            }, children: _jsx("div", { className: "w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(PlusIcon, {}) }) })) : null] }), chatLogs.filter((log) => log.type === "you_are_the_hero")
                                    .length === 0 ? (_jsx(NavLink, { to: "/game/new", onClick: isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined, children: _jsxs("div", { className: "flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]", children: [_jsx("div", { className: "h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(PlusIcon, {}) }), _jsx("span", { className: "pl-[10px]", children: t("New game") })] }) })) : (chatLogs
                                    .filter((log) => log.type === "you_are_the_hero")
                                    .map((game) => (_jsxs("div", { className: "group flex flex-row justify-between items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]", children: [_jsx(NavLink, { to: `/game/${game.threadId}`, className: "h-full grow flex items-center w-[calc(100%-40px)]", onClick: isSmallScreen
                                                ? () => dispatch(toggleLeftPanel())
                                                : undefined, children: _jsx("div", { className: "truncate grow", children: t(game.title ?? "") }) }, game.threadId), game.isBeingDeleted ? (_jsx("div", { className: "h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(LoadingIcon, {}) })) : (_jsx("div", { className: clsx({
                                                hidden: displayOptionDropdownId !== game.threadId,
                                            }, "group-hover:block cursor-pointer ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"), onClick: (event) => handleDropdownClick(event, game.threadId), children: _jsx(OptionsIcon, {}) })), displayOptionDropdownId === game.threadId &&
                                            dropdownPosition && (_jsx("div", { style: {
                                                position: "fixed",
                                                top: dropdownPosition.top,
                                                left: dropdownPosition.left,
                                            }, className: "z-20", children: _jsx(OptionsDropdown, { type: "you_are_the_hero", threadId: game.threadId, hide: () => setDisplayOptionDropdownId(null) }) }))] }))))] }), _jsxs("div", { className: "h-auto w-full flex flex-col ml-[10px] pr-[20px]", children: [_jsxs("div", { className: "font-bold h-[40px] content-center flex flex-row justify-between items-center", children: [_jsx("div", { className: "font-bold h-[40px] content-center", children: t("Stories") }), chatLogs.filter((log) => log.type === "story").length > 0 ? (_jsx(NavLink, { to: "/story/new", onClick: () => {
                                                if (isSmallScreen && isLeftPanelOpen)
                                                    dispatch(toggleLeftPanel());
                                                sendEvent("click_plus_story_from_left_panel");
                                            }, children: _jsx("div", { className: "w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(PlusIcon, {}) }) })) : null] }), chatLogs.filter((log) => log.type === "story").length === 0 ? (_jsx(NavLink, { to: "/story/new", onClick: isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined, children: _jsxs("div", { className: "flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]", children: [_jsx("div", { className: "h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(PlusIcon, {}) }), _jsx("span", { className: "pl-[10px]", children: t("New story") })] }) })) : (chatLogs
                                    .filter((log) => log.type === "story")
                                    .map((story) => (_jsxs("div", { className: "group flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]", children: [_jsx(NavLink, { to: `/story/${story.threadId}`, className: "h-full grow flex items-center w-[calc(100%-40px)]", onClick: isSmallScreen
                                                ? () => dispatch(toggleLeftPanel())
                                                : undefined, children: _jsx("div", { className: "truncate", children: t(story.title ?? "") }) }, story.threadId), story.isBeingDeleted ? (_jsx("div", { className: "h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary", children: _jsx(LoadingIcon, {}) })) : (_jsx("div", { className: clsx({
                                                hidden: displayOptionDropdownId !== story.threadId,
                                            }, "group-hover:block cursor-pointer  ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"), onClick: (event) => handleDropdownClick(event, story.threadId), children: _jsx(OptionsIcon, {}) })), displayOptionDropdownId === story.threadId &&
                                            dropdownPosition && (_jsx("div", { style: {
                                                position: "fixed",
                                                top: dropdownPosition.top,
                                                left: dropdownPosition.left,
                                            }, className: "z-20", children: _jsx(OptionsDropdown, { type: "story", threadId: story.threadId, hide: () => setDisplayOptionDropdownId(null) }) }))] }))))] })] })] }) }));
};
export default LeftPanel;
