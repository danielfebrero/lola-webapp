import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import lolaPortrait from "../../../public/lola-portrait.jpg";

import SendChatInput from "../../components/SendChatInput";
import useWebSocket from "../../hooks/useWebSocket";

const LandingPage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { sendMessage } = useWebSocket({
    setThreadId,
  });

  const sendMessageToCharacter = (content: string, threadId: string | null) => {
    sendMessage(content, "character", threadId);
    setCanSendMessage(false);
  };

  useEffect(() => {
    if (threadId) {
      navigate("/character/" + threadId);
    }
  }, [threadId]);

  return (
    <div className="bg-white dark:bg-darkMainSurfacePrimary h-screen w-screen flex flex-col justify-center text-textPrimary dark:text-darkTextPrimary">
      <div className="flex flex-row items-center justify-betwween w-full h-full">
        <div className="flex-col flex w-full h-full">
          <div className="flex flex-col ml-[20px] mt-[20px]">
            <div className="text-8xl">Lola</div>
            <div className="text-xl">
              {t("Choose your own adventure and storyteller.")}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center h-full mt-[-120px]">
            <div className="text-4xl text-center">
              {t("Describe a character")}
            </div>
            <div className="mt-[20px] w-[60%]">
              <SendChatInput
                type="character"
                isChatInputAvailable={true}
                canSendMessage={canSendMessage}
                onSend={(message) => sendMessageToCharacter(message, null)}
              />
            </div>
            <div className="flex flex-row mt-[40px]">
              <Link to={"/character/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight">
                  {t("New character")}
                </div>
              </Link>
              <Link to={"/story/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] mx-[20px] cursor-pointer border border-borderLight dark:border-darkBorderLight">
                  {t("New story")}
                </div>
              </Link>
              <Link to={"/game/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight">
                  {t("New game")}
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="grow mr-[20px] h-[calc(100vh-160px)] right-[20px] flex justify-center  flex-shrink-0">
          <img
            src={lolaPortrait.src}
            alt={"Lola"}
            className="object-cover  h-[calc(100vh-160px)]"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
