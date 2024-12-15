import { useParams } from "react-router";
import { useEffect, useRef } from "react";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

const StoryPage: React.FC = () => {
  const params = useParams();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "story", objectId: params.storyId })
    );
  }, [params.storyId]);

  return (
    <div className="flex justify-center h-full">
      <div className="grow pt-[10px] pb-[20px] flex flex-col h-[calc(100vh-75px)]">
        <div
          ref={chatContainerRef}
          className="grow overflow-y-scroll justify-center flex"
        >
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
