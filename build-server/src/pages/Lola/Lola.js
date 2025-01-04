import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentlyViewing, setChatLog as setChatLogAction, } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import { addChatLog } from "../../store/features/app/appSlice";
import Meta from "../../components/Meta";
const LolaPage = () => {
    const [chatLog, setChatLog] = useState([]);
    const [threadId, setThreadId] = useState(null);
    const params = useParams();
    const dispatch = useAppDispatch();
    const chatContainerRef = useRef(null);
    const navigate = useNavigate();
    const { sendMessage, socketConnection, getThreadChatLog } = useWebSocket({
        setThreadId,
    });
    const chatLogs = useAppSelector((state) => state.app.chatLogs);
    const chatState = useAppSelector((state) => state.app.chatLogs.find((log) => log.threadId === params.conversationId));
    const sendMessageToLola = (content, threadId) => {
        sendMessage(content, "lola", threadId);
        if (chatLog.length === 0)
            setChatLog([{ role: "user", content }]);
    };
    useEffect(() => {
        if (params.conversationId) {
            console.log("get thread chat log");
            dispatch(setChatLogAction({
                threadId: params.conversationId,
                isLoading: true,
                isInputAvailable: false,
            }));
            setThreadId(params.conversationId);
            if (socketConnection?.readyState === WebSocket.OPEN) {
                getThreadChatLog(params.conversationId);
            }
        }
    }, [params.storyId, socketConnection?.readyState]);
    useEffect(() => {
        const log = chatLogs.find((log) => log.threadId === params.conversationId)?.chatLog ??
            chatLog;
        setChatLog(log);
    }, [chatLogs]);
    useEffect(() => {
        if (threadId) {
            if (chatLog.length === 1)
                dispatch(addChatLog({
                    threadId,
                    content: chatLog[0].content,
                    role: "user",
                    type: "lola",
                }));
            navigate("/lola/" + threadId);
        }
    }, [threadId]);
    useEffect(() => {
        if (!params.conversationId) {
            setThreadId(null);
            setChatLog([]);
        }
    }, [params.conversationId]);
    useEffect(() => {
        dispatch(setCurrentlyViewing({
            objectType: "lola",
            objectId: params.conversationId,
        }));
    }, [params.conversationId, dispatch]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [chatLog]);
    return (_jsxs(_Fragment, { children: [_jsx(Meta, { title: "Lola" }), _jsx("div", { className: "flex justify-center h-full", children: _jsxs("div", { className: "grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]", children: [_jsx("div", { ref: chatContainerRef, className: "grow overflow-y-scroll no-scrollbar justify-center flex", children: _jsx(Chat, { type: "lola", id: params.conversationId, chatLog: chatLog, isChatLoading: chatState?.isLoading ?? false }) }), _jsx("div", { className: "justify-center flex w-full", children: _jsx("div", { className: "w-[65%]", children: _jsx(SendChatInput, { type: "lola", onSend: (message) => sendMessageToLola(message, threadId), canSendMessage: chatState?.canSendMessage ?? true, isChatInputAvailable: chatState?.isInputAvailable ?? true }) }) })] }) })] }));
};
export default LolaPage;
