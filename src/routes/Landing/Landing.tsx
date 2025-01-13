import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import lolaPortrait from "../../../public/lola-portrait.jpg";

import SendChatInput from "../../components/SendChatInput";
import useWebSocket from "../../hooks/useWebSocket";
import SendIcon from "../../icons/send";

const LandingPage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

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

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/character/new");
    }
  }, [auth]);

  return (
    <div className="bg-white dark:bg-darkMainSurfacePrimary h-screen w-screen flex flex-col justify-center text-textPrimary dark:text-darkTextPrimary">
      <div className="flex flex-row items-center justify-betwween w-full h-full">
        <div className="flex-col flex w-full h-full">
          <div className="flex flex-col ml-[40px] mt-[40px]">
            <div className="text-8xl">Lola</div>
            <div className="text-xl">
              {t("Choose your own adventure and storyteller.")}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center h-full mt-[-120px]">
            <div className="text-4xl text-center">
              {t("Describe a character")}
            </div>
            <div className="mt-[20px] md:w-[60%] w-[80%] flex flex-row">
              <SendChatInput
                type="character"
                isChatInputAvailable={true}
                canSendMessage={canSendMessage}
                onSend={(m) => sendMessageToCharacter(m, null)}
                onChange={(m) => setMessage(m)}
              />
              <div
                className="w-[48px] h-[48px] cursor-pointer"
                onClick={() => sendMessageToCharacter(message, null)}
              >
                <SendIcon />
              </div>
            </div>
            <div className="flex md:flex-row flex-col mt-[40px]">
              <Link to={"/character/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  {t("New character")}
                </div>
              </Link>
              <Link to={"/story/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] md:mx-[20px] my-[20px] md:my-0 cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  {t("New story")}
                </div>
              </Link>
              <Link to={"/game/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  {t("New game")}
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block grow mr-[20px] h-[calc(100vh-160px)] right-[20px] flex justify-center  flex-shrink-0">
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
