import SendChatInputLayout from "./SendChatInput";
import ChatLayout from "./Chat";

interface CharacterLayoutProps {
  chatLog?: Message[];
}

const CharacterLayout: React.FC<CharacterLayoutProps> = (props) => {
  return (
    <div className="grow pl-5 pr-5 pt-2.5 md:pb-5 pb-[10px] flex flex-row overflow-y-scroll no-scrollbar">
      <div className="grow md:border-r-2 md:border-borderColor dark:md:border-darkBorderColor md:w-1/2 md:pr-5 flex flex-col h-full overflow-y-scroll no-scrollbar">
        <div className="grow overflow-y-scroll no-scrollbar justify-center flex">
          <ChatLayout chatLog={props.chatLog} />
        </div>
        <div className="justify-center flex w-full md:px-0 px-[30px]">
          <SendChatInputLayout />
        </div>
      </div>
      <div className="grow md:w-1/2 md:pl-5 flex items-center flex-col h-[calc(100vh-110px)]"></div>
    </div>
  );
};

export default CharacterLayout;
