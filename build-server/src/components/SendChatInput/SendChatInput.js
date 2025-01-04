import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const SendChatInput = (props) => {
    const [value, setValue] = useState("");
    const { t } = useTranslation();
    const textAreaRef = useRef(null);
    const handleInput = (event) => {
        const textarea = event.target;
        textarea.style.height = `auto`;
        textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`;
        setValue(textarea.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (props.onSend && value.trim() !== "" && props.canSendMessage) {
                props.onSend(value.trim());
                setValue("");
                if (textAreaRef.current) {
                    textAreaRef.current.style.height = "24px";
                }
            }
        }
    };
    useEffect(() => {
        textAreaRef.current?.focus();
    }, [props]);
    return (_jsx("div", { className: "w-full h-auto flex justify-center items-center", children: _jsx("div", { className: "w-full flex items-center bg-lightGray dark:bg-darkMessageBackground rounded-lg p-[10px]", children: _jsx("textarea", { ref: textAreaRef, value: value, onChange: handleInput, onKeyDown: handleKeyDown, disabled: !props.isChatInputAvailable, className: "bg-transparent border-none placeholder:text-textSecondary dark:placeholder:text-darkTextSecondary outline-none w-full overflow-hidden resize-none", placeholder: t("Type a message and press Enter to send..."), rows: 1 }) }) }));
};
export default SendChatInput;
