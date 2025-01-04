import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing, setCharacter, setChatLog as setChatLogAction, } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import ExploreIcon from "../../icons/explore";
import ChatIcon from "../../icons/chat";
import useGA from "../../hooks/useGA";
import Meta from "../../components/Meta";
const CharacterPage = (props) => {
    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const { sendEvent } = useGA();
    const newroleChat = useCallback(() => [
        {
            content: t("Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?"),
            role: "assistant",
            type: "character",
        },
    ], [t]);
    const chatLogState = useAppSelector((state) => state.app.chatLogs.find((log) => log.threadId === params.characterId)
        ?.chatLog ?? newroleChat);
    const chatState = useAppSelector((state) => state.app.chatLogs.find((log) => log.threadId === params.characterId));
    const { isSmallScreen, isLeftPanelOpen } = useAppSelector((state) => state.app);
    const character = useAppSelector((state) => state.app.characters.find((char) => char.threadId === params.characterId) ?? {});
    const [threadId, setThreadId] = useState(null);
    const [chatLog, setChatLog] = useState([]);
    const dispatch = useAppDispatch();
    useState(true);
    const [mobileView, setMobileView] = useState("chat");
    const [selectedRightViewType, setSelectedRightViewType] = useState("report");
    const { sendMessage, getThreadChatLog, getCharacter, socketConnection } = useWebSocket({
        setThreadId,
    });
    const sendMessageToCharacter = (content, threadId) => {
        console.log({ content, threadId });
        sendMessage(content, "character", threadId);
        if (chatLog.length === 1)
            setChatLog((prev) => [...prev, { role: "user", content }]);
    };
    const handleViewTypeChange = (viewType) => {
        setSelectedRightViewType(viewType);
    };
    useEffect(() => {
        if (params.characterId &&
            params.characterId !== "new" &&
            threadId !== params.characterId) {
            dispatch(setChatLogAction({
                threaId: params.characterId,
                isLoading: true,
                isInputAvailable: false,
            }));
            dispatch(setCharacter({
                threadId: params.characterId,
                isImageProcessing: true,
                isReportProcessing: true,
            }));
            if (socketConnection?.readyState === WebSocket.OPEN) {
                setThreadId(params.characterId);
                setTimeout(() => {
                    if (params.characterId) {
                        getThreadChatLog(params.characterId);
                        getCharacter(params.characterId);
                    }
                }, 50);
            }
        }
    }, [
        dispatch,
        getCharacter,
        getThreadChatLog,
        params.characterId,
        socketConnection?.readyState,
        threadId,
    ]);
    useEffect(() => {
        if (params.characterId &&
            params.characterId !== "new" &&
            params.characterId !== "main" &&
            socketConnection?.readyState === WebSocket.OPEN) {
            getThreadChatLog(params.characterId);
            getCharacter(params.characterId);
        }
    }, [socketConnection?.readyState]);
    useEffect(() => {
        if (threadId) {
            navigate("/character/" + threadId);
        }
    }, [threadId]);
    useEffect(() => {
        if (chatLogState &&
            params.characterId !== "new" &&
            params.characterId !== "main")
            setChatLog(chatLogState);
    }, [chatLogState, params.characterId]);
    useEffect(() => {
        if (params.characterId === "new") {
            setThreadId(null);
            setChatLog(newroleChat);
        }
    }, [newroleChat, params.characterId]);
    useEffect(() => {
        setThreadId(params.characterId !== "new" ? params.characterId ?? null : null);
        return () => {
            setThreadId(null);
        };
    }, []);
    // useEffect(() => {
    //   // const mainId =
    //   //   chatLogs.filter((log) => log.type === "character")[0]?.threadId ?? null;
    //   // if (props.selected?.type === "main" && mainId && threadId !== mainId) {
    //   //   navigate("/character/" + mainId);
    //   // }
    //   if (props.selected?.type === "main") {
    //     navigate("/character/new");
    //   }
    // }, [props.selected, chatLogs]);
    useEffect(() => {
        dispatch(setCurrentlyViewing({ objectType: "character", objectId: threadId }));
    }, [dispatch, threadId]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [chatLog]);
    return (_jsxs(_Fragment, { children: [_jsx(Meta, { title: character.json?.name ?? t("Character") }), _jsxs("div", { className: "grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll no-scrollbar", children: [isSmallScreen && !isLeftPanelOpen && (_jsxs("div", { className: "fixed flex flex-col text-textSecondary dark:text-darkTextSecondary left-[15px] w-auto", children: [_jsx("div", { className: "h-[24px] w-[24px]  mt-[20px]", onClick: () => setMobileView("chat"), children: _jsx(ChatIcon, {}) }), _jsx("div", { className: "h-[24px] w-[24px]  mt-[20px]", onClick: () => setMobileView("report"), children: _jsx(ExploreIcon, {}) })] })), (!isSmallScreen || mobileView === "chat") && (_jsxs("div", { className: "grow md:border-r-2 md:border-borderColor dark:md:border-darkBorderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll no-scrollbar", children: [_jsx("div", { className: "grow overflow-y-scroll no-scrollbar", ref: chatContainerRef, children: _jsx(Chat, { type: "character", id: threadId, chatLog: chatLog, isChatLoading: chatState?.isLoading ?? false }) }), _jsx("div", { className: "justify-center flex w-full md:px-0 px-[30px]", children: _jsx(SendChatInput, { type: "character", id: threadId, isChatInputAvailable: chatState?.isInputAvailable ?? true, canSendMessage: chatState?.canSendMessage ?? true, onSend: (message) => sendMessageToCharacter(message, threadId) }) })] })), (!isSmallScreen || mobileView === "report") && (_jsxs("div", { className: "grow md:w-1/2 pl-10 md:pl-5 flex items-center flex-col h-[calc(100vh-110px)]", children: [_jsx("div", { className: "bg-lightGray dark:bg-darkLightGray p-[5px] rounded-lg w-fit flex flex-row", children: ["report", "images"].map((viewType) => (_jsx("div", { onClick: () => {
                                        sendEvent("click_char_" + viewType);
                                        handleViewTypeChange(viewType.toLowerCase());
                                    }, className: clsx("cursor-pointer", "pl-[20px] pr-[20px] pt-[5px] pb-[5px]", "rounded-lg", {
                                        "text-textPrimary dark:text-darkTextPrimary border border-borderLight bg-white dark:bg-darkMessageBackground": selectedRightViewType === viewType.toLowerCase(),
                                        "text-gray-400": selectedRightViewType !== viewType.toLowerCase(),
                                    }), children: t(viewType.charAt(0).toUpperCase() + viewType.slice(1)) }, viewType))) }), _jsxs("div", { className: "mt-4 w-full   overflow-y-scroll no-scrollbar", children: [selectedRightViewType === "report" && (_jsx("div", { className: "w-full", children: _jsx(ReportView, { type: "character", id: threadId, json: character.json, images: character.images, imagesMultisize: character.imagesMultisize, isProcessing: character.isReportProcessing ?? false, isImageGenerating: character.isImageProcessing ?? false }) })), selectedRightViewType === "json" && (_jsx("div", { className: "w-full", children: _jsx(JSONView, { type: "character", id: threadId, json: character.json, isProcessing: character.isReportProcessing ?? false }) })), selectedRightViewType === "images" && (_jsx("div", { className: "w-full", children: _jsx(ImageView, { type: "character", id: threadId, images: character.images, imagesMultisize: character.imagesMultisize, isImageGenerating: character.isImageProcessing ?? false }) }))] })] }))] })] }));
};
export default CharacterPage;
