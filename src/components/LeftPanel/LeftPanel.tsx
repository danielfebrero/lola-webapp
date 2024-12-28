import { useState } from "react";
import { NavLink } from "react-router";
import clsx from "clsx";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import OptionsIcon from "../../icons/options";
import PlusIcon from "../../icons/plus";
import LoadingIcon from "../../icons/loading";
import imageDani from "../../dani.webp";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import CharacterOptionsDropdown from "../CharacterOptionsDropdown";

const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const [displayCharacterDropdownId, setDisplayCharacterDropdownId] = useState<
    string | null
  >(null);
  const newChatLocation = useNewChatLocation();
  const { isLeftPanelOpen, chatLogs, characters, isSmallScreen } =
    useAppSelector((state) => state.app);

  const games = [
    {
      id: "098DF098SDFQ08F-dani-tome-1",
      label: "Dani Tome 1",
    },
  ];

  return (
    <div
      className={clsx(
        {
          "min-w-[260px] w-[260px]": isLeftPanelOpen,
          "min-w-0 w-0": !isLeftPanelOpen,
        },
        `transition-all duration-500 h-screen bg-lightGray`
      )}
    >
      <div className="h-screen w-[260px] flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary">
            <div
              className="h-[24px] w-[24px] cursor-pointer"
              onClick={() => dispatch(toggleLeftPanel())}
            >
              <PanelIcon />
            </div>
            <NavLink
              to={newChatLocation}
              onClick={
                isSmallScreen && isLeftPanelOpen
                  ? () => dispatch(toggleLeftPanel())
                  : undefined
              }
            >
              <div className="h-[24px] w-[24px]">
                <NewChatIcon />
              </div>
            </NavLink>
          </div>
        </div>
        <div className="h-auto w-[calc(100%+20px)] flex flex-col overflow-y-scroll overflow-x-clip pb-[20px] ml-[-10px] mr-[-10px] no-scrollbar">
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div>Characters</div>
              {chatLogs.filter((log) => log.type === "character").length > 0 ? (
                <NavLink
                  to="/character/new"
                  onClick={
                    isSmallScreen
                      ? () => dispatch(toggleLeftPanel())
                      : undefined
                  }
                >
                  <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                    <PlusIcon />
                  </div>
                </NavLink>
              ) : null}
            </div>
            {chatLogs.filter((log) => log.type === "character").length === 0 ? (
              <NavLink
                to="/character/new"
                onClick={
                  isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined
                }
              >
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <div className="h-[20px] w-[20px] text-textSecondary">
                    <PlusIcon />
                  </div>
                  <span className="pl-[10px]">New character</span>
                </div>
              </NavLink>
            ) : (
              chatLogs
                .filter((log) => log.type === "character")
                .map((char) => (
                  <div className="group flex flex-row items-center h-[40px] hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] justify-between">
                    <NavLink
                      key={char.threadId}
                      className="flex grow h-full items-center"
                      onClick={
                        isSmallScreen
                          ? () => dispatch(toggleLeftPanel())
                          : undefined
                      }
                      to={
                        char.type === "main"
                          ? "/character/main"
                          : `/character/${char.threadId}`
                      }
                    >
                      <div className="flex flex-row">
                        <div
                          className={clsx(
                            {
                              "bg-gray-200 rounded-full":
                                characters.find(
                                  (c) => c.threadId === char.threadId
                                )?.images?.[0] === undefined,
                            },
                            "h-[24px] w-[24px]"
                          )}
                        >
                          {" "}
                          {characters.find((c) => c.threadId === char.threadId)
                            ?.images?.[0] ? (
                            <img
                              src={
                                characters.find(
                                  (c) => c.threadId === char.threadId
                                )?.images?.[0] ?? imageDani
                              }
                              className="rounded-full h-[24px] w-[24px] object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="pl-[10px] truncate">
                          {characters.find((c) => c.threadId === char.threadId)
                            ?.json?.name ?? char.title}
                        </span>
                      </div>
                    </NavLink>
                    {char.isBeingDeleted ? (
                      <div className="h-[24px] w-[24px] text-textSecondary">
                        <LoadingIcon />
                      </div>
                    ) : (
                      <div
                        className="group-hover:block hidden cursor-pointer h-[24px] w-[24px] text-textSecondary"
                        onClick={() =>
                          setDisplayCharacterDropdownId(char.threadId)
                        }
                      >
                        <OptionsIcon />
                      </div>
                    )}

                    {displayCharacterDropdownId === char.threadId && (
                      <div className="left-[260px] z-20">
                        <CharacterOptionsDropdown
                          threadId={char.threadId}
                          hide={() => setDisplayCharacterDropdownId(null)}
                        />
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div className="font-bold h-[40px] content-center">Games</div>
              {games.length > 0 ? (
                <NavLink
                  to="/game/new"
                  onClick={
                    isSmallScreen
                      ? () => dispatch(toggleLeftPanel())
                      : undefined
                  }
                >
                  <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                    <PlusIcon />
                  </div>
                </NavLink>
              ) : null}
            </div>
            {games.length === 0 ? (
              <NavLink
                to="/game/new"
                onClick={
                  isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined
                }
              >
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <div className="h-[20px] w-[20px] text-textSecondary">
                    <PlusIcon />
                  </div>
                  <span className="pl-[10px]">New game</span>
                </div>
              </NavLink>
            ) : (
              games.map((game) => (
                <NavLink
                  to={`/game/${game.id}`}
                  key={game.id}
                  onClick={
                    isSmallScreen
                      ? () => dispatch(toggleLeftPanel())
                      : undefined
                  }
                >
                  <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                    <span className="truncate">{game.label}</span>
                  </div>
                </NavLink>
              ))
            )}
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div className="font-bold h-[40px] content-center">Stories</div>
              {chatLogs.filter((log) => log.type === "story").length > 0 ? (
                <NavLink
                  to="/story/new"
                  onClick={
                    isSmallScreen
                      ? () => dispatch(toggleLeftPanel())
                      : undefined
                  }
                >
                  <div className="w-[24px] h-[24px] hover:bg-gray-200 rounded-lg cursor-pointer p-[5px] text-textSecondary">
                    <PlusIcon />
                  </div>
                </NavLink>
              ) : null}
            </div>
            {chatLogs.filter((log) => log.type === "story").length === 0 ? (
              <NavLink
                to="/story/new"
                onClick={
                  isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined
                }
              >
                <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <div className="h-[20px] w-[20px] text-textSecondary">
                    <PlusIcon />
                  </div>
                  <span className="pl-[10px]">New story</span>
                </div>
              </NavLink>
            ) : (
              chatLogs
                .filter((log) => log.type === "story")
                .map((story) => (
                  <NavLink
                    to={`/story/${story.threadId}`}
                    key={story.threadId}
                    onClick={
                      isSmallScreen
                        ? () => dispatch(toggleLeftPanel())
                        : undefined
                    }
                  >
                    <div className="flex flex-row items-center hover:bg-gray-200 rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                      <span className="truncate">
                        {story.title ?? "New Conversation"}
                      </span>
                    </div>
                  </NavLink>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
