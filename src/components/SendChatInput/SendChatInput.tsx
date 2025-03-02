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
  setThread,
} from "../../store/features/app/appSlice";
import clsx from "clsx";
import ShieldIcon from "../../icons/shield";
import GlobeIcon from "../../icons/globe";
import ArtIcon from "../../icons/art";
import SpreadIcon from "../../icons/spread";
import AdultIcon from "../../icons/adult";
import useGA from "../../hooks/useGA";
import ChevronDownIcon from "../../icons/chevronDown";
import { capitalizeFirstLetter } from "../../utils/string";

interface SendChatInputProps {
  type: "character" | "story" | "game" | "lola";
  threadId?: string | null;
  onSend?: (message: string) => void;
  onChange?: (message: string) => void;
  isChatInputAvailable: boolean;
  canSendMessage: boolean;
  showPrivate?: boolean;
  canMakePrivate?: boolean;
  isPrivate?: boolean;
  setPrivate?: (val: boolean) => void;
  showImageSearch?: boolean;
  setImageSearch?: (val: boolean) => void;
  canSendEmptyMessage?: boolean;
  showGenImage?: boolean;
  setGenImage?: (val: boolean) => void;
  genImage?: boolean;
  genImageModel?: string;
  setGenImageModel?: (val: string) => void;
  showShortMessage?: boolean;
  setShortMessage?: (val: boolean) => void;
  shortMessage?: boolean;
  showUncensored?: boolean;
  setUncensored?: (val: boolean) => void;
  uncensored?: boolean;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");
  const [showImageModelSelector, setShowImageModelSelector] =
    useState<boolean>(false);
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isSmallScreen, lastRequestIdWaitingForThreadId, chatLogs } =
    useAppSelector((state) => state.app);
  const { quotas } = useAppSelector((state) => state.user);
  const { stopRequestId } = useWebSocket({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [turnOnImageSearch, setTurnOnImageSearch] = useState<boolean>(false);
  const { sendEvent } = useGA();

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = `auto`;
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`;
    setValue(textarea.value);
    if (props.onChange) props.onChange(textarea.value);
  };

  const toggleImageModelSelector = () => {
    setShowImageModelSelector(!showImageModelSelector);
  };

  const handleStop = useCallback(() => {
    if (props.threadId) {
      const lastRequestId = chatLogs.find(
        (log) => log.threadId === props.threadId
      )?.lastRequestId;
      if (lastRequestId) {
        stopRequestId(lastRequestId);
        dispatch(addRequestStopped(lastRequestId));
      }
      dispatch(
        setThread({
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
    dispatch,
  ]);

  const setImageGenModelBasedOnQuotas = () => {
    if (quotas.images_classic_plus > 0) {
      props.setGenImageModel &&
        props.setGenImageModel(
          props.genImageModel === "classic" ? "classic+" : "classic"
        );
    } else {
      props.genImageModel === "classic"
        ? navigate("/pricing")
        : props.setGenImageModel && props.setGenImageModel("classic");
    }
  };

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
    if (props.setImageSearch) props.setImageSearch(turnOnImageSearch);
  }, [turnOnImageSearch]);

  useEffect(() => {
    if (!isSmallScreen) textAreaRef.current?.focus();
  }, [isSmallScreen, props]);

  useEffect(() => {
    if (props.setPrivate && props.uncensored)
      props.setPrivate(props.uncensored);
  }, [props.uncensored]);

  useEffect(() => {
    if (props.setUncensored && props.isPrivate === false)
      props.setUncensored(false);
  }, [props.isPrivate]);

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
            !props.showShortMessage &&
            !props.showUncensored && (
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
          props.showUncensored ||
          props.showShortMessage) && (
          <div className="flex flex-row items-center w-full p-[10px] mt-[20px] text-sm">
            <div className="overflow-x-scroll w-[calc(100vw-120px)] no-scrollbar">
              <div className="flex flex-row w-auto items-center ">
                {props.showUncensored && (
                  <div
                    onClick={() =>
                      props.setUncensored
                        ? props.setUncensored(!props.uncensored)
                        : null
                    }
                    className={clsx(
                      {
                        "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                          props.uncensored,
                      },
                      "rounded-full border border-borderColor dark:border-darkBorderColor py-[5px] px-[10px] mr-[10px] cursor-pointer flex flex-row items-center"
                    )}
                  >
                    <div className="w-[18px] h-[18px] mr-[10px]">
                      <AdultIcon />
                    </div>
                    <div className="whitespace-nowrap">{t("Uncensored")}</div>
                  </div>
                )}

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
                    <div className="whitespace-nowrap">
                      {t("Short message")}
                    </div>
                  </div>
                )}

                {props.showPrivate && (
                  <div
                    onClick={
                      props.canMakePrivate
                        ? () =>
                            props.setPrivate &&
                            props.setPrivate(!props.isPrivate)
                        : () => {
                            sendEvent("click_private", "chat_input");
                            navigate("/pricing");
                          }
                    }
                    className={clsx(
                      {
                        "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                          props.isPrivate,
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
                    <div className="whitespace-nowrap">{t("Image search")}</div>
                  </div>
                )}

                {props.showGenImage && (
                  <div
                    className={clsx(
                      {
                        "text-textOptionSelected dark:text-darkTextOptionSelected bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected":
                          props.genImage,
                      },
                      "rounded-full border border-borderColor dark:border-darkBorderColor py-[5px] px-[10px] mr-[10px] cursor-pointer flex flex-row items-center"
                    )}
                  >
                    <div
                      className="flex flex-row items-center"
                      onClick={() =>
                        props.setGenImage && props.setGenImage(!props.genImage)
                      }
                    >
                      <div className="w-[18px] h-[18px] mr-[5px]">
                        <ArtIcon />
                      </div>
                      <span className="whitespace-nowrap">
                        {t("Generate image")}
                      </span>
                    </div>
                    <div
                      className="flex flex-row items-center"
                      onClick={toggleImageModelSelector}
                    >
                      <div className="text-textSecondary dark:text-darkTextSecondary ml-[5px]">
                        <span>
                          {t(capitalizeFirstLetter(props.genImageModel ?? ""))}
                        </span>
                        {showImageModelSelector && (
                          <div className="absolute bg-lightGray dark:bg-darkMessageBackground rounded-2xl p-[10px] ml-[-10px]">
                            <div
                              className="flex flex-row items-center"
                              onClick={setImageGenModelBasedOnQuotas}
                            >
                              <span>
                                {t(
                                  props.genImageModel === "classic"
                                    ? "Classic+"
                                    : "Classic"
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="h–[20px] w-[20px] ml-[5px]">
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
