import { jsx as _jsx } from "react/jsx-runtime";
import { useLocation } from "react-router";
import Markdown from "markdown-to-jsx";
import clsx from "clsx";
import Loading from "../Loading";
const Chat = (props) => {
    const location = useLocation();
    return (_jsx("div", { className: "w-full max-w-[715px]", children: props.isChatLoading ? (_jsx(Loading, {})) : (_jsx("div", { className: "w-full flex", children: _jsx("div", { className: "w-auto grow mb-[30px]", children: props.chatLog?.map((message, idx) => message.role === "user" ? (_jsx("div", { className: "flex flex-row justify-end mb-[20px]", children: _jsx("div", { className: clsx({
                            "max-w-[60%]": location.pathname.indexOf("/story") === 0,
                            "max-w-[80%]": location.pathname.indexOf("/story") !== 0,
                        }, "w-fit  bg-messageBackground dark:bg-darkMessageBackground rounded-lg p-[10px]"), children: _jsx(Markdown, { children: message.content }) }) }, message.id ?? message.timestamp ?? idx)) : (_jsx("div", { className: "flex flex-row mb-[10px]", children: _jsx("div", { className: "grow max-w-[100%] px-[30px]", children: _jsx(Markdown, { children: message.content }) }) }, message.timestamp ?? idx))) }) })) }));
};
export default Chat;
