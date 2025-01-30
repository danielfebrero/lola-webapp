import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../store/hooks";
import SendIcon from "../../icons/send";
import StopIcon from "../../icons/stop";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppDispatch } from "../../store/hooks";
import {
  addRequestStopped,
  setChatLog,
} from "../../store/features/app/appSlice";
import { threadId } from "worker_threads";

interface SendChatInputProps {
  type: "character" | "story" | "game" | "lola";
  threadId?: string | null;
  onSend?: (message: string) => void;
  onChange?: (message: string) => void;
  isChatInputAvailable: boolean;
  canSendMessage: boolean;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isSmallScreen, lastRequestIdWaitingForThreadId, chatLogs } =
    useAppSelector((state) => state.app);
  const { stopRequestId } = useWebSocket({});
  const dispatch = useAppDispatch();

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = `auto`;
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`;
    setValue(textarea.value);
    if (props.onChange) props.onChange(textarea.value);
  };

  const handleStop = useCallback(() => {
    if (props.threadId) {
      stopRequestId(props.threadId);
      dispatch(
        addRequestStopped(
          chatLogs.find((log) => log.threadId === props.threadId)?.lastRequestId
        )
      );
      dispatch(
        setChatLog({
          threadId: props.threadId,
          isInputAvailable: true,
          isLoading: false,
          canSendMessage: true,
          isRequestStopped: true,
        })
      );
    } else if (lastRequestIdWaitingForThreadId) {
      stopRequestId(lastRequestIdWaitingForThreadId);
    }
  }, [
    lastRequestIdWaitingForThreadId,
    props.threadId,
    stopRequestId,
    chatLogs,
  ]);

  const handleSend = () => {
    const trimmedValue = value.trim();

    if (props.onSend && trimmedValue !== "" && props.canSendMessage) {
      // Use TextEncoder to compute the byte length of the message
      const encoder = new TextEncoder();
      const encodedMessage = encoder.encode(trimmedValue);

      console.log({ length: encodedMessage.length, message: trimmedValue });

      if (encodedMessage.length > 16384 / 2) {
        // 16KB limit: 16384 bytes
        console.error("Message exceeds the maximum size of 8KB.");
        return;
      }

      // If within limit, send the message
      props.onSend(trimmedValue);
      setValue("");

      if (textAreaRef.current) {
        textAreaRef.current.style.height = "24px";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (!isSmallScreen) textAreaRef.current?.focus();
  }, [isSmallScreen, props]);

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex items-center bg-lightGray dark:bg-darkMessageBackground rounded-lg p-[10px]">
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={!props.isChatInputAvailable}
          className="bg-transparent border-none placeholder:text-textSecondary dark:placeholder:text-darkTextSecondary outline-none w-full overflow-hidden resize-none"
          placeholder={t("Type a message and press Enter to send...")}
          rows={1}
        ></textarea>

        {!props.canSendMessage && props.isChatInputAvailable ? (
          <div
            className="w-[36px] h-[36px] cursor-pointer"
            onClick={handleStop}
          >
            <StopIcon />
          </div>
        ) : (
          <div
            className="w-[36px] h-[36px] cursor-pointer"
            onClick={handleSend}
          >
            <SendIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default SendChatInput;
