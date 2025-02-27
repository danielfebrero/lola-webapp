import clsx from "clsx";
import ChatLayout from "./Chat";
import SendChatInputLayout from "./SendChatInput";
import { Character } from "../../types/characters";
import ReportViewLayout from "./ReportView";
import { ChatLog, Message } from "../../types/chat";
import VoteLayout from "./Vote";

interface CharacterLayoutProps {
  chatLog?: Message[];
  isOwner?: boolean;
  threadId?: string;
  character?: Character;
  thread?: ChatLog;
}

const CharacterLayout: React.FC<CharacterLayoutProps> = (props) => {
  const newroleChat = [
    {
      content:
        "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
      role: "assistant",
      type: "character",
    },
  ];
  return (
    <>
      <div className="grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll no-scrollbar h-full">
        <div className="md:flex hidden grow md:border-r-2 md:border-borderColor dark:md:border-darkBorderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll no-scrollbar h-full">
          <div className="grow overflow-y-scroll no-scrollbar justify-center flex h-full">
            <ChatLayout chatLog={props.chatLog ?? newroleChat} />
          </div>

          {(props.isOwner || props.threadId === "new") && (
            <div className="justify-center flex w-full">
              <SendChatInputLayout />
            </div>
          )}
          {!props.isOwner && props.threadId !== "new" && (
            <div className="flex flex-row w-full">
              <div className="grow mr-[20px] rounded-full border border-borderColor dark:border-darkBorderColor text-center py-[5px] cursor-pointer">
                Create a character
              </div>
              <VoteLayout votes={props.thread?.votes ?? 0} />
            </div>
          )}
        </div>

        <div className="grow md:w-1/2 md:pl-5 flex items-center flex-col h-[calc(100vh-110px)]">
          <div className="bg-lightGray dark:bg-darkLightGray p-[5px] rounded-lg w-fit flex flex-row">
            {["chat", "report", "images"].map((viewType) => (
              <div
                key={viewType}
                className={clsx(
                  "md:hidden block",
                  "cursor-pointer",
                  "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                  "rounded-lg",
                  {
                    "text-textPrimary dark:text-darkTextPrimary border border-borderLight bg-white dark:bg-darkMessageBackground":
                      "chat" === viewType.toLowerCase(),
                    "text-gray-400": "chat" !== viewType.toLowerCase(),
                  }
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </div>
            ))}
            {["report", "images"].map((viewType) => (
              <div
                key={viewType}
                className={clsx(
                  "md:block hidden",
                  "cursor-pointer",
                  "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                  "rounded-lg",
                  {
                    "text-textPrimary dark:text-darkTextPrimary border border-borderLight bg-white dark:bg-darkMessageBackground":
                      "report" === viewType.toLowerCase(),
                    "text-gray-400": "report" !== viewType.toLowerCase(),
                  }
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </div>
            ))}
          </div>
          <div className="mt-4 w-full grow overflow-y-scroll no-scrollbar">
            <div className="md:hidden block flex h-full flex-col">
              <div className="grow overflow-y-scroll no-scrollbar">
                <ChatLayout chatLog={props.chatLog ?? newroleChat} />
              </div>

              {(props.isOwner || props.threadId === "new") && (
                <div className="justify-center flex w-full md:px-0 px-[10px]">
                  <SendChatInputLayout />
                </div>
              )}
              {!props.isOwner && props.threadId !== "new" && (
                <div className="flex flex-row w-full">
                  <div className="grow mr-[20px] rounded-full border border-borderColor dark:border-darkBorderColor text-center py-[5px] cursor-pointer">
                    Create a character
                  </div>
                  <VoteLayout votes={props.thread?.votes ?? 0} />
                </div>
              )}
            </div>
            <div className="w-full md:block hidden">
              <ReportViewLayout
                type="character"
                id={props.threadId}
                json={props.character?.json}
                images={props.character?.images}
                imagesMultisize={props.character?.imagesMultisize}
                isProcessing={props.character?.isReportProcessing ?? false}
                isImageGenerating={props.character?.isImageProcessing ?? false}
                summary={props.character?.summary}
                avatar={props.character?.avatar}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterLayout;
