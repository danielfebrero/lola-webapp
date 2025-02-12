import { use, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setChatLog,
  setCurrentlyViewing,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";
import SendChatInput from "../../components/SendChatInput";

const NewStoryPage: React.FC = () => {
  const { plan } = useAppSelector((state) => state.user);
  const { t } = useTranslation();
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [AIInputValue, setAIInputValue] = useState<string>("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [newIsPrivate, setNewIsPrivate] = useState<boolean>(plan !== "free");
  const [turnOnImageSearch, setTurnOnImageSearch] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { characters, lastRequestIdWaitingForThreadId } = useAppSelector(
    (state) => state.app
  );

  const gameSetThreadId = (threadId: string | null) => {
    setThreadId(threadId);
    dispatch(
      setChatLog({
        threadId,
        lastRequestId: lastRequestIdWaitingForThreadId,
      })
    );
  };

  const { sendMessage, socketConnection } = useWebSocket({
    setThreadId: gameSetThreadId,
  });
  const { getCharacters } = useAPI();
  const [uncensored, setUncensored] = useState<boolean>(plan !== "free");

  const createStory = (context: string) => {
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(context);

    if (encodedMessage.length > 16384 / 2) {
      // 16KB limit: 16384 bytes
      console.error("Message exceeds the maximum size of 8KB.");
      return;
    }
    sendMessage(context, "story", null, {
      characters: selectedCharacters,
      isPrivate: newIsPrivate,
      turnOnImageSearch,
    });
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
      navigate("/story/" + threadId);
    }
  }, [threadId]);

  return (
    <>
      <Meta title={t("New story")} />
      <div className="flex flex-col h-full justify-center items-center overflow-y-scroll no-scrollbar pt-[30px] md:pt-0">
        <div className="flex flex-col items-center w-full h-full md:pt-[30px]">
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
          <div className="grid grid-cols-3 md:grid-cols-5 md:w-[70%] w-full flex-wrap justify-center no-scrollbar">
            {characters.map((char) => (
              <div
                className="flex flex-col items-center m-[10px] cursor-pointer"
                onClick={() => {
                  selectedCharacters.includes(char.thread_id)
                    ? setSelectedCharacters(
                        selectedCharacters.filter((id) => id !== char.thread_id)
                      )
                    : setSelectedCharacters([
                        ...selectedCharacters,
                        char.thread_id,
                      ]);
                }}
              >
                {characters.find((c) => c.thread_id === char.thread_id)
                  ?.imagesMultisize?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      alt={char.name}
                      src={
                        characters.find((c) => c.thread_id === char.thread_id)
                          ?.imagesMultisize?.[0].medium
                      }
                      className={clsx(
                        {
                          "border-4 border-green-700":
                            selectedCharacters.includes(char.thread_id),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : characters.find((c) => c.thread_id === char.thread_id)
                    ?.images?.[0] ? (
                  <div className="h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200">
                    <img
                      alt={char.name}
                      src={
                        characters.find((c) => c.thread_id === char.thread_id)
                          ?.images?.[0]
                      }
                      className={clsx(
                        {
                          "border-4 border-green-700":
                            selectedCharacters.includes(char.thread_id),
                        },
                        "rounded-full h-[64px] w-[64px] object-cover"
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={clsx(
                      {
                        "border-4 border-green-700":
                          selectedCharacters.includes(char.thread_id),
                      },
                      "h-[64px] w-[64px] mb-[10px] rounded-full bg-slate-200 animate-pulse"
                    )}
                  ></div>
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
          <div className="flex flex-row items-center md:max-w-[715px] w-[100%] px-[20px] mt-[60px] pb-[20px]">
            <SendChatInput
              type="story"
              isChatInputAvailable={!hasSentMessage}
              canSendMessage={!hasSentMessage}
              showPrivate={true}
              isPrivate={newIsPrivate}
              showImageSearch={true}
              canMakePrivate={plan !== "free"}
              setPrivate={setNewIsPrivate}
              setImageSearch={setTurnOnImageSearch}
              onSend={createStory}
              canSendEmptyMessage={true}
              showUncensored={plan !== "free"}
              setUncensored={setUncensored}
              uncensored={uncensored}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewStoryPage;
