import clsx from "clsx";
import SendChatInputLayout from "./SendChatInput";
import ChatLayout from "./Chat";
import Loading from "../Loading";
import JSONToText from "../JSONToText";

interface CharacterLayoutProps {
  chatLog?: Message[];
  report?: Record<any, any>;
}

const CharacterLayout: React.FC<CharacterLayoutProps> = (props) => {
  const selectedRightViewType = "report";
  return (
    <div className="grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll no-scrollbar">
      <div className="grow md:border-r-2 md:border-borderColor dark:md:border-darkBorderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll no-scrollbar">
        <div className="grow overflow-y-scroll no-scrollbar justify-center flex">
          <ChatLayout chatLog={props.chatLog} isLoading={!props.chatLog} />
        </div>
        <div className="justify-center flex w-full md:px-0 px-[30px]">
          <SendChatInputLayout />
        </div>
      </div>
      <div className="grow md:w-1/2 md:pl-5 flex items-center flex-col h-[calc(100vh-110px)]">
        <div className="bg-lightGray dark:bg-darkLightGray p-[5px] rounded-lg w-fit flex flex-row">
          {["report", "images"].map((viewType) => (
            <div
              key={viewType}
              className={clsx(
                "cursor-pointer",
                "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                "rounded-lg",
                {
                  "text-textPrimary dark:text-darkTextPrimary border border-borderLight bg-white dark:bg-darkMessageBackground":
                    selectedRightViewType === viewType.toLowerCase(),
                  "text-gray-400":
                    selectedRightViewType !== viewType.toLowerCase(),
                }
              )}
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </div>
          ))}
        </div>
        <div className="w-full">
          {!props.report ? <Loading /> : <JSONToText data={props.report} />}
        </div>
      </div>
    </div>
  );
};

export default CharacterLayout;
