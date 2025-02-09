import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useAppSelector } from "../../store/hooks";
import SendIcon from "../../icons/send";
import StopIcon from "../../icons/stop";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppDispatch } from "../../store/hooks";
import {
  addRequestStopped,
  setChatLog,
} from "../../store/features/app/appSlice";
import clsx from "clsx";
import ShieldIcon from "../../icons/shield";
import GlobeIcon from "../../icons/globe";
import ArtIcon from "../../icons/art";
import SpreadIcon from "../../icons/spread";

interface SendChatInputProps {
  type: "character" | "story" | "game" | "lola";
  threadId?: string | null;
  onSend?: (message: string) => void;
  onChange?: (message: string) => void;
  isChatInputAvailable: boolean;
  canSendMessage: boolean;
  showPrivate?: boolean;
  canMakePrivate?: boolean;
  setPrivate?: (val: boolean) => void;
  showImageSearch?: boolean;
  setImageSearch?: (val: boolean) => void;
  canSendEmptyMessage?: boolean;
  showGenImage?: boolean;
  setGenImage?: (val: boolean) => void;
  genImage?: boolean;
  showShortMessage?: boolean;
  setShortMessage?: (val: boolean) => void;
  shortMessage?: boolean;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isSmallScreen, lastRequestIdWaitingForThreadId, chatLogs } =
    useAppSelector((state) => state.app);
  const { stopRequestId } = useWebSocket({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [turnOnImageSearch, setTurnOnImageSearch] = useState<boolean>(false);
  const [turnOnImageGen, setTurnOnImageGen] = useState<boolean>(
    props.genImage ?? false
  );

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

    if (
      props.onSend &&
      (trimmedValue !== "" || props.canSendEmptyMessage) &&
      props.canSendMessage
    ) {
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
    if (props.setPrivate) props.setPrivate(isPrivate);
  }, [isPrivate]);

  useEffect(() => {
    if (props.setImageSearch) props.setImageSearch(turnOnImageSearch);
  }, [turnOnImageSearch]);

  useEffect(() => {
    if (props.setGenImage) props.setGenImage(turnOnImageGen);
  }, [turnOnImageGen]);

  useEffect(() => {
    if (!isSmallScreen) textAreaRef.current?.focus();
  }, [isSmallScreen, props]);

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex flex-col items-center bg-lightGray dark:bg-darkMessageBackground rounded-2xl p-[10px]">
        <div className="flex flex-row w-full items-center">
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

          {!props.showImageSearch &&
            !props.showPrivate &&
            !props.showGenImage &&
            !props.showShortMessage && (
              <>
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
              </>
            )}
        </div>
        {(props.showPrivate ||
          props.showImageSearch ||
          props.showGenImage ||
          props.showShortMessage) && (
          <div className="flex flex-row items-center w-full p-[10px] mt-[20px] text-sm">
            {props.showShortMessage && (
              <div
                onClick={() =>
                  props.setShortMessage
                    ? props.setShortMessage(!props.shortMessage)
                    : null
                }
                className={clsx(
                  {
                    "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                      props.shortMessage,
                  },
                  "rounded-full border border-borderColor dark:border-darkBorderColor py-[5px] px-[10px] mr-[10px] cursor-pointer flex flex-row items-center"
                )}
              >
                <div className="w-[18px] h-[18px] mr-[10px]">
                  <SpreadIcon />
                </div>
                <span>{t("Short message")}</span>
              </div>
            )}

            {props.showPrivate && (
              <div
                onClick={
                  props.canMakePrivate
                    ? () => setIsPrivate(!isPrivate)
                    : () => navigate("/pricing")
                }
                className={clsx(
                  {
                    "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                      isPrivate,
                  },
                  "rounded-full border border-borderColor dark:border-darkBorderColor py-[5px] px-[10px] mr-[10px] cursor-pointer flex flex-row items-center"
                )}
              >
                <div className="w-[18px] h-[18px] mr-[5px]">
                  <ShieldIcon />
                </div>
                <span>{t("Private")}</span>
              </div>
            )}

            {props.showImageSearch && (
              <div
                onClick={() => setTurnOnImageSearch(!turnOnImageSearch)}
                className={clsx(
                  {
                    "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                      turnOnImageSearch,
                  },
                  "rounded-full border border-borderColor dark:border-darkBorderColor py-[5px] px-[10px] mr-[10px] cursor-pointer flex flex-row items-center"
                )}
              >
                <div className="w-[18px] h-[18px] mr-[5px]">
                  <GlobeIcon />
                </div>
                <span>{t("Image search")}</span>
              </div>
            )}

            {props.showGenImage && (
              <div
                onClick={() => setTurnOnImageGen(!turnOnImageGen)}
                className={clsx(
                  {
                    "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                      turnOnImageGen,
                  },
                  "rounded-full border border-borderColor dark:border-darkBorderColor py-[5px] px-[10px] mr-[10px] cursor-pointer flex flex-row items-center"
                )}
              >
                <div className="w-[18px] h-[18px] mr-[5px]">
                  <ArtIcon />
                </div>
                <span>{t("Generate image")}</span>
              </div>
            )}

            <div className="justify-end flex grow">
              {!props.canSendMessage && props.isChatInputAvailable ? (
                <div
                  className="w-[36px] h-[36px] cursor-pointer rounded-full border border-borderColor dark:border-darkBorderColor"
                  onClick={handleStop}
                >
                  <StopIcon />
                </div>
              ) : (
                <div
                  className="w-[36px] h-[36px] cursor-pointer rounded-full border border-borderColor dark:border-darkBorderColor"
                  onClick={handleSend}
                >
                  <SendIcon />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendChatInput;
