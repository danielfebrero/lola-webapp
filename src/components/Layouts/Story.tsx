import { Message } from "../../types/chat";
import ChatLayout from "./Chat";

interface StoryLayoutProps {
  chatLog?: Message[];
}

const StoryLayout: React.FC<StoryLayoutProps> = ({ chatLog }) => {
  return (
    <div className="grow overflow-y-scroll no-scrollbar justify-center flex px-5">
      <ChatLayout chatLog={chatLog} />
    </div>
  );
};

export default StoryLayout;
