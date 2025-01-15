import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import lolaPortrait from "../../../public/lola-portrait.jpg";

import SendChatInput from "../../components/SendChatInput";
import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import useGA from "../../hooks/useGA";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setMode } from "../../store/features/app/appSlice";

const LandingPage: React.FC = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();
  const { sendEvent } = useGA();
  const { mode } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { sendMessage } = useWebSocket({
    setThreadId,
  });

  const sendMessageToCharacter = (content: string, threadId: string | null) => {
    sendMessage(content, "character", threadId);
    setCanSendMessage(false);
  };

  useEffect(() => {
    if (window.location.pathname === "/18") dispatch(setMode("adult"));
  }, [window.location.pathname]);

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
    <>
      <div className="md:hidden block bg-white dark:bg-darkMainSurfacePrimary h-full w-full flex flex-col text-textPrimary dark:text-darkTextPrimary">
        <div className=" min-h-[40%]">
          <div className="flex flex-row">
            <div className="text-6xl grow items-center flex">
              <span className="text-center w-full">Lola</span>
            </div>
            <div className="h-[200px] right-0">
              <img
                src={lolaPortrait.src}
                alt={"Lola"}
                className="object-cover h-full"
              />
            </div>
          </div>
          <div className="p-[10px] flex flex-col">
            <div className="text-xl mt-[20px]">
              {t("Choose your own adventure and storyteller.")}
            </div>
          </div>
        </div>
        <div className="p-[10px] flex flex-col">
          <div className="text-4xl text-center mt-[40px]">
            {t("Describe a character")}
          </div>
          <div className="w-full flex justify-center">
            <div className="mt-[20px] w-[80%]">
              <SendChatInput
                type="character"
                isChatInputAvailable={true}
                canSendMessage={canSendMessage}
                onSend={(m) => sendMessageToCharacter(m, null)}
              />
            </div>
          </div>
          <div className="w-full justify-center flex mb-[40px]">
            <div className="flex flex-col mt-[40px] w-[60%]">
              <Link
                to={"/character/new"}
                onClick={() =>
                  sendEvent("click_new_char_from_landing_page", "character")
                }
              >
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  {t("New character")}
                </div>
              </Link>
              <Link
                to={"/story/new"}
                onClick={() =>
                  sendEvent("click_new_story_from_landing_page", "story")
                }
              >
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] md:mx-[20px] my-[5px] md:my-0 cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  {t("New story")}
                </div>
              </Link>
              <Link
                to={"/game/new"}
                onClick={() =>
                  sendEvent(
                    "click_new_game_from_landing_page",
                    "you_are_the_hero"
                  )
                }
              >
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  {t("New game")}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="md:block hidden bg-white dark:bg-darkMainSurfacePrimary h-screen w-screen flex flex-col justify-center text-textPrimary dark:text-darkTextPrimary">
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
                />
              </div>
              <div className="flex md:flex-row flex-col mt-[40px]">
                <Link
                  to={"/character/new"}
                  onClick={() =>
                    sendEvent("click_new_char_from_landing_page", "character")
                  }
                >
                  <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                    {t("New character")}
                  </div>
                </Link>
                <Link
                  to={"/story/new"}
                  onClick={() =>
                    sendEvent("click_new_story_from_landing_page", "story")
                  }
                >
                  <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] md:mx-[20px] my-[20px] md:my-0 cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                    {t("New story")}
                  </div>
                </Link>
                <Link
                  to={"/game/new"}
                  onClick={() =>
                    sendEvent(
                      "click_new_game_from_landing_page",
                      "you_are_the_hero"
                    )
                  }
                >
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
    </>
  );
};

export default LandingPage;
