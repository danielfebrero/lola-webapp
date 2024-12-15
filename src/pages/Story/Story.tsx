import { useParams } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";

const StoryPage: React.FC = () => {
  const params = useParams();
  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] pb-[20px] flex flex-col  h-[calc(100vh-75px)]">
        <div className="grow overflow-y-scroll justify-center flex">
          <Chat type="story" id={params.storyId} />
        </div>
        <div className="justify-center flex w-full">
          <div className="w-[715px]">
            <SendChatInput type="story" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
