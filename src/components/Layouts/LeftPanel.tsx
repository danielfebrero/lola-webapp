import clsx from "clsx";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import PlusIcon from "../../icons/plus";

const LeftPanelLayout: React.FC = () => {
  return (
    <div
      className={clsx(
        `min-w-[260px] w-[260px] md:block hidden h-screen bg-lightGray dark:bg-darkLightGray left-0 top-0`
      )}
    >
      <div className="h-screen w-[260px] flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary dark:text-darkTextSecondary">
            <div className="h-[24px] w-[24px] cursor-pointer">
              <PanelIcon />
            </div>

            <div className="h-[24px] w-[24px] cursor-pointer">
              <NewChatIcon />
            </div>
          </div>
        </div>
        <div className="h-auto w-[calc(100%+20px)] flex flex-col overflow-y-scroll overflow-x-clip pb-[20px] ml-[-10px] mr-[-10px] no-scrollbar">
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div>Explore</div>
            </div>
            <a href="/explore/characters/latest">
              <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <span className="">Characters</span>
              </div>
            </a>
            <a href="/explore/stories/latest">
              <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <span className="">Stories</span>
              </div>
            </a>
            <a href="/explore/images">
              <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <span className="">Images</span>
              </div>
            </a>
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div>Characters</div>
            </div>
            <a href="/character/new">
              <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New character</span>
              </div>
            </a>
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div className="font-bold h-[40px] content-center">Games</div>
            </div>
            <a href="/game/new">
              <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New game</span>
              </div>
            </a>
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div className="font-bold h-[40px] content-center">Stories</div>
            </div>
            <a href="/story/new">
              <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New story</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanelLayout;
