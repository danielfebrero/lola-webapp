import lolaPortrait from "../../../public/lola-portrait.jpg";

const LandingLayout: React.FC = ({}) => {
  return (
    <div className="bg-white dark:bg-darkMainSurfacePrimary h-screen w-screen flex flex-col justify-center text-textPrimary dark:text-darkTextPrimary">
      <div className="flex flex-row items-center justify-betwween w-full h-full">
        <div className="flex-col flex w-full h-full">
          <div className="flex flex-col ml-[40px] mt-[40px]">
            <div className="text-8xl">Lola</div>
            <div className="text-xl">
              Choose your own adventure and storyteller.
            </div>
          </div>
          <div className="flex flex-col justify-center items-center h-full mt-[-120px]">
            <div className="text-4xl text-center">Describe a character</div>
            <div className="mt-[20px] md:w-[60%] w-[80%] flex flex-row">
              <SendChatInput
                type="character"
                isChatInputAvailable={false}
                canSendMessage={false}
                onSend={() => true}
              />
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

export default LandingLayout;
