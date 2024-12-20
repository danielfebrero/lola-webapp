import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import clsx from "clsx";

import imageDani from "../../dani.webp";
import imageLola from "../../lola.jpeg";

import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import SendIcon from "../../icons/send";

import { useAppDispatch } from "../../store/hooks";
import {
  addChatLog,
  setCurrentlyViewing,
} from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";

const characters = [
  {
    id: "random",
    label: "Random",
    image: imageDani,
  },
  {
    id: "2329890kj09-claire",
    label: "Claire",
    image: imageLola,
  },
  {
    id: "dani01",
    label: "Dani",
    image: imageDani,
  },
  {
    id: "2329890kj09-claire-2",
    label: "Claire",
    image: imageLola,
  },
  {
    id: "dani01-2",
    label: "Dani",
    image: imageDani,
  },
];

const NewStoryPage: React.FC = () => {
  const [showAIInput, setShowAIInput] = useState<boolean>(false);
  const [context, setContext] = useState<string>("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [hasSentMessage, setHasSentMessage] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { sendMessage } = useWebSocket({ setThreadId });

  const createStory = () => {
    sendMessage(context, "story", null);
    setHasSentMessage(true);
  };

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: "story", objectId: null }));
  }, []);

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

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="flex flex-col items-center">
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
            className="w-[60%] outline-none border rounded-full p-[10px]"
            onKeyDown={(e) => e.key === "Enter" && setShowAIInput(false)}
          />
        </div>
        <div className="font-semibold text-lg mb-[20px]">Characters</div>
        <div className="flex flex-row">
          {characters.map((char) => (
            <div
              className="flex flex-col items-center mx-[10px] cursor-pointer"
              onClick={() => {
                selectedCharacters.includes(char.id)
                  ? setSelectedCharacters(
                      selectedCharacters.filter((id) => id !== char.id)
                    )
                  : setSelectedCharacters([...selectedCharacters, char.id]);
              }}
            >
              <div className="h-[64px] w-[64px] mb-[10px]">
                <img
                  src={char.image}
                  className={clsx(
                    {
                      "border-4 border-green-700": selectedCharacters.includes(
                        char.id
                      ),
                    },
                    "rounded-full h-[64px] w-[64px] object-cover"
                  )}
                />
              </div>
              <div className="text-textSecondary">{char.label}</div>
            </div>
          ))}
          <div
            className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary cursor-pointer"
            onClick={() => setShowAIInput(true)}
          >
            <PlusIcon />
          </div>
        </div>
        <div className="font-semibold text-lg mt-[40px] mb-[20px]">Context</div>
        <div className="flex flex-row items-center">
          <textarea
            className="rounded-lg border border-lightBorder resize-none h-[100px] w-[400px] outline-none p-[10px]"
            onChange={(e) => setContext(e.target.value)}
          >
            {context}
          </textarea>
          <div
            className={clsx(
              { "bg-black": !hasSentMessage, "bg-gray-400": hasSentMessage },
              "ml-[20px] w-[32px] h-[32px] text-white rounded-full flex justify-center items-center cursor-pointer"
            )}
            onClick={hasSentMessage ? undefined : createStory}
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStoryPage;
