import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import SendIcon from "../../icons/send";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addChatLog,
  setCurrentlyViewing,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";

const NewStoryPage: React.FC = () => {
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [AIInputValue, setAIInputValue] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { sendMessage, getCharacters, socketConnection } = useWebSocket({
    setThreadId,
  });
  const { characters } = useAppSelector((state) => state.app);

  const createStory = () => {
    sendMessage(context, "story", null, { characters: selectedCharacters });
    setHasSentMessage(true);
  };

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: "story", objectId: null }));
  }, [dispatch]);

  useEffect(() => {
    if (socketConnection?.readyState === WebSocket.OPEN) {
      getCharacters();
    }
  }, [socketConnection?.readyState]);

  useEffect(() => {
    if (threadId) {
      dispatch(
        addChatLog({
          threadId,
          content: context,
          role: "user",
          type: "story",
        })
      );
      navigate("/story/" + threadId);
    }
  }, [threadId]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  return (
    <>
      <Meta title={t("New story")} />
      <div className="flex flex-col h-full justify-center items-center overflow-y-scroll no-scrollbar pt-[30px] md:pt-0">
        <div className="flex flex-col items-center w-full h-full justify-center">
          <div
            className={clsx(
              { hidden: !showAIInput },
              "absolute top-[50px] w-[calc(100%-260px)] h-[calc(100%-50px)] bg-white flex flex-col justify-center items-center"
            )}
          >
            <div className="flex justify-end w-[60%]">
              <div
                className="h-[24px] w-[24px] m-[10px] cursor-pointer"
                onClick={() => setShowAIInput(false)}
              >
                <CloseIcon />
              </div>
            </div>
            <input
              type="text"
              placeholder="Dani's dentist, she is a sexy 34yo petite brunette"
              value={AIInputValue}
              onChange={(e) => setAIInputValue(e.target.value)}
              className="w-[60%] outline-none border rounded-full p-[10px]"
              onKeyDown={(e) => e.key === "Enter" && setShowAIInput(false)}
            />
          </div>
          <div className="font-semibold text-lg mb-[20px]">
            {t("Characters")}
          </div>
          <div className="grid grid-cols-5 md:w-[70%] w-full flex-wrap justify-center no-scrollbar">
            {characters.map((char) => (
              <div
                className="flex flex-col items-center m-[10px] cursor-pointer"
                onClick={() => {
                  selectedCharacters.includes(char.threadId)
                    ? setSelectedCharacters(
                        selectedCharacters.filter((id) => id !== char.threadId)
                      )
                    : setSelectedCharacters([
                        ...selectedCharacters,
                        char.threadId,
                      ]);
                }}
              >
                {characters.find((c) => c.threadId === char.threadId)
                  ?.imagesMultisize?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      src={
                        characters.find((c) => c.threadId === char.threadId)
                          ?.imagesMultisize?.[0].medium
                      }
                      className={clsx(
                        {
                          "border-4 border-green-700":
                            selectedCharacters.includes(char.threadId),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : characters.find((c) => c.threadId === char.threadId)
                    ?.images?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      src={
                        characters.find((c) => c.threadId === char.threadId)
                          ?.images?.[0]
                      }
                      className={clsx(
                        {
                          "border-4 border-green-700":
                            selectedCharacters.includes(char.threadId),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200 animate-pulse"></div>
                )}
                <div className="text-textSecondary dark:text-darkTextSecondary">
                  {char.json?.name}
                </div>
              </div>
            ))}
            <NavLink
              to={"/character/new"}
              className="flex items-center justify-center"
            >
              <div
                className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary dark:text-darkTextSecondary cursor-pointer flex"
                // onClick={() => setShowAIInput(true)}
              >
                <PlusIcon />
              </div>
            </NavLink>
          </div>
          <div className="font-semibold text-lg mt-[40px] mb-[20px]">
            {t("Context")}
          </div>
          <div className="flex flex-row items-center">
            <textarea
              className="rounded-lg border border-lightBorder resize-none h-[100px] md:w-[400px] w-[100%] outline-none p-[10px] dark:bg-darkMessageBackground"
              onChange={(e) => setContext(e.target.value)}
              ref={textAreaRef}
            >
              {context}
            </textarea>
            <div
              className={clsx(
                { "bg-black": !hasSentMessage, "bg-gray-400": hasSentMessage },
                "min-w-[32px] ml-[20px] w-[32px] h-[32px] text-white rounded-full flex justify-center items-center cursor-pointer"
              )}
              onClick={hasSentMessage ? undefined : createStory}
            >
              <SendIcon />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewStoryPage;
