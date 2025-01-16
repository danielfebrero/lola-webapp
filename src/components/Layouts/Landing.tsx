import { Link } from "react-router";
import lolaPortrait from "../../../public/lola-portrait.jpg";
import SendChatInputLayout from "./SendChatInput";

const LandingLayout: React.FC = ({}) => {
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
              Choose your own adventure and storyteller.
            </div>
          </div>
        </div>
        <div className="p-[10px] flex flex-col">
          <div className="text-4xl text-center mt-[40px]">
            Describe a character
          </div>
          <div className="w-full flex justify-center">
            <div className="mt-[20px] w-[80%]">
              <SendChatInputLayout />
            </div>
          </div>
          <div className="w-full justify-center flex mb-[40px]">
            <div className="flex flex-col mt-[40px] w-[60%]">
              <a href={"/character/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  New character
                </div>
              </a>
              <a href={"/story/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] md:mx-[20px] my-[5px] md:my-0 cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  New story
                </div>
              </a>
              <a href={"/game/new"}>
                <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                  New game
                </div>
              </a>
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
                Choose your own adventure and storyteller.
              </div>
            </div>
            <div className="flex flex-col justify-center items-center h-full mt-[-120px]">
              <div className="text-4xl text-center">Describe a character</div>
              <div className="mt-[20px] md:w-[60%] w-[80%] flex flex-row">
                <SendChatInputLayout />
              </div>
              <div className="flex md:flex-row flex-col mt-[40px]">
                <a href={"/character/new"}>
                  <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                    New character
                  </div>
                </a>
                <a href={"/story/new"}>
                  <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] md:mx-[20px] my-[20px] md:my-0 cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                    New story
                  </div>
                </a>
                <a href={"/game/new"}>
                  <div className="bg-lightGray dark:bg-darkLightGray rounded-lg px-[10px] py-[5px] cursor-pointer border border-borderLight dark:border-darkBorderLight text-center">
                    New game
                  </div>
                </a>
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

export default LandingLayout;
