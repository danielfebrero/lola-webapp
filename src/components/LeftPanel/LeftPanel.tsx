import { NavLink } from "react-router";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import PlusIcon from "../../icons/plus";
import imageDani from "../../dani.webp";
import imageClaire from "../../lola.jpeg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import clsx from "clsx";

const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const newChatLocation = useNewChatLocation();
  const isLeftPanelOpen = useAppSelector((state) => state.app.isLeftPanelOpen);

  const characters = [
    {
      id: "dani01",
      label: "Dani",
      type: "main",
      image: imageDani,
    },
    {
      id: "2329890kj09-claire",
      label: "Claire",
      image: imageClaire,
    },
  ];

  const stories = [
    {
      id: "qsqf909Ddsdf-a-random-story",
      label: "A random story",
    },
  ];

  return (
    <div
      className={clsx(
        {
          "w-[260px]": isLeftPanelOpen,
          "w-0": !isLeftPanelOpen,
        },
        `transition-all duration-500`
      )}
    >
      <div className="h-screen w-[260px] bg-lightGray flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary">
            <div
              className="h-[24px] w-[24px] cursor-pointer"
              onClick={() => dispatch(toggleLeftPanel())}
            >
              <PanelIcon />
            </div>
            <NavLink to={newChatLocation}>
              <div className="h-[24px] w-[24px]">
                <NewChatIcon />
              </div>
            </NavLink>
          </div>
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
            <div>Characters</div>
            {characters.length > 0 ? (
              <NavLink to="/character/new">
                <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                  <PlusIcon />
                </div>
              </NavLink>
            ) : null}
          </div>
          {characters.length == 0 ? (
            <NavLink to="/character/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New character</span>
              </div>
            </NavLink>
          ) : (
            characters.map((char) => (
              <NavLink
                to={
                  char.type === "main"
                    ? "/character/main"
                    : `/character/${char.id}`
                }
              >
                <div className="flex flex-row items-center h-[40px] hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px]">
                  <div className="h-[24px] w-[24px]">
                    <img
                      src={char.image}
                      className="rounded-full h-[24px] w-[24px]"
                    />
                  </div>
                  <span className="pl-[10px]">{char.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center">Games</div>
          <NavLink to="/game/new">
            <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
              <div className="h-[20px] w-[20px] text-textSecondary">
                <PlusIcon />
              </div>
              <span className="pl-[10px]">New game</span>
            </div>
          </NavLink>
        </div>
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] content-center">Stories</div>
          {stories.length === 0 ? (
            <NavLink to="/story/new">
              <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                <div className="h-[20px] w-[20px] text-textSecondary">
                  <PlusIcon />
                </div>
                <span className="pl-[10px]">New story</span>
              </div>
            </NavLink>
          ) : (
            stories.map((story) => (
              <NavLink to={`/story/${story.id}`}>
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <span className="">{story.label}</span>
                </div>
              </NavLink>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
