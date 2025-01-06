import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";
import OptionsIcon from "../../icons/options";
import PlusIcon from "../../icons/plus";
import LoadingIcon from "../../icons/loading";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftPanel } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import OptionsDropdown from "../OptionsDropdown";
import useClickOutside from "../../hooks/useClickOutside";
import useGA from "../../hooks/useGA";

const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [displayOptionDropdownId, setDisplayOptionDropdownId] = useState<
    string | null
  >(null);
  const [clickedElement, setClickedElement] = useState<DOMRect | null>(null);
  const newChatLocation = useNewChatLocation();
  const { isLeftPanelOpen, chatLogs, characters, isSmallScreen } =
    useAppSelector((state) => state.app);
  const { sendEvent } = useGA();
  // const games = useAppSelector((state) => state.games.scenarios);

  const outsideRef = useClickOutside(() =>
    isLeftPanelOpen && isSmallScreen ? dispatch(toggleLeftPanel()) : null
  );
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleDropdownClick = (event: React.MouseEvent, threadId: string) => {
    const domRect = event.currentTarget.getBoundingClientRect();
    setClickedElement(domRect);
    const scrollContainer = scrollRef.current?.getBoundingClientRect();

    if (scrollContainer) {
      setDropdownPosition({
        top: (domRect?.top ?? 0) - scrollContainer.top + 70,
        left:
          (domRect?.left ?? 0) -
          scrollContainer.left +
          scrollRef.current!.scrollLeft +
          30,
      });
    }
    setDisplayOptionDropdownId(threadId);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (displayOptionDropdownId && dropdownPosition && scrollRef.current) {
        setDisplayOptionDropdownId(null);
      }
    };

    const scrollContainer = scrollRef.current;
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [
    clickedElement,
    displayOptionDropdownId,
    dropdownPosition,
    setDropdownPosition,
  ]);

  return (
    <div
      ref={outsideRef}
      className={clsx(
        {
          "min-w-[260px] w-[260px]": isLeftPanelOpen,
          "min-w-0 w-0": !isLeftPanelOpen,
        },
        `transition-all duration-500 h-screen bg-lightGray dark:bg-darkLightGray`
      )}
    >
      <div className="h-screen w-[260px] flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary dark:text-darkTextSecondary">
            <div
              className="h-[24px] w-[24px] cursor-pointer"
              onClick={() => {
                dispatch(toggleLeftPanel());
                sendEvent("click_toggle_left_panel");
              }}
            >
              <PanelIcon />
            </div>
            <NavLink
              to={newChatLocation}
              onClick={() => {
                if (isSmallScreen && isLeftPanelOpen)
                  dispatch(toggleLeftPanel());
                sendEvent("click_new_chat_from_left_panel");
              }}
            >
              <div className="h-[24px] w-[24px]">
                <NewChatIcon />
              </div>
            </NavLink>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="h-auto w-[calc(100%+20px)] flex flex-col overflow-y-scroll overflow-x-clip pb-[20px] ml-[-10px] mr-[-10px] no-scrollbar"
        >
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div>{t("Characters")}</div>
              {chatLogs.filter((log) => log.type === "character").length > 0 ? (
                <NavLink
                  to="/character/new"
                  onClick={() => {
                    if (isSmallScreen && isLeftPanelOpen)
                      dispatch(toggleLeftPanel());
                    sendEvent("click_plus_char_from_left_panel");
                  }}
                >
                  <div className="w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary">
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
                <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
                    <PlusIcon />
                  </div>
                  <span className="pl-[10px]">{t("New character")}</span>
                </div>
              </NavLink>
            ) : (
              chatLogs
                .filter((log) => log.type === "character")
                .map((char) => (
                  <div
                    key={char.threadId}
                    className="group flex flex-row items-center h-[40px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] justify-between"
                  >
                    <NavLink
                      key={char.threadId}
                      className="h-full grow flex items-center w-[calc(100%-40px)]"
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
                            ?.imagesMultisize?.[0] ? (
                            <img
                              src={
                                characters.find(
                                  (c) => c.threadId === char.threadId
                                )?.imagesMultisize?.[0]?.small
                              }
                              className="rounded-full h-[24px] w-[24px] object-cover"
                            />
                          ) : characters.find(
                              (c) => c.threadId === char.threadId
                            )?.images?.[0] ? (
                            <img
                              src={
                                characters.find(
                                  (c) => c.threadId === char.threadId
                                )?.imagesMultisize?.[0]?.small ??
                                characters.find(
                                  (c) => c.threadId === char.threadId
                                )?.images?.[0]
                              }
                              className="rounded-full h-[24px] w-[24px] object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="pl-[10px] truncate">
                          {t(
                            characters.find((c) => c.threadId === char.threadId)
                              ?.json?.name ??
                              char.title ??
                              ""
                          )}
                        </span>
                      </div>
                    </NavLink>
                    {char.isBeingDeleted ? (
                      <div className="h-[24px] w-[24px] text-textSecondar dark:text-darkTextSecondary">
                        <LoadingIcon />
                      </div>
                    ) : (
                      <div
                        className={clsx(
                          {
                            hidden: displayOptionDropdownId !== char.threadId,
                          },
                          "group-hover:block cursor-pointer ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"
                        )}
                        onClick={(event) =>
                          handleDropdownClick(event, char.threadId)
                        }
                      >
                        <OptionsIcon />
                      </div>
                    )}

                    {displayOptionDropdownId === char.threadId &&
                      dropdownPosition && (
                        <div
                          style={{
                            // position: "fixed",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                          }}
                          className="z-20 absolute"
                        >
                          <OptionsDropdown
                            type="character"
                            threadId={char.threadId}
                            hide={() => setDisplayOptionDropdownId(null)}
                          />
                        </div>
                      )}
                  </div>
                ))
            )}
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div className="font-bold h-[40px] content-center">
                {t("Games")}
              </div>
              {chatLogs.filter((log) => log.type === "you_are_the_hero")
                .length > 0 ? (
                <NavLink
                  to="/game/new"
                  onClick={() => {
                    if (isSmallScreen && isLeftPanelOpen)
                      dispatch(toggleLeftPanel());
                    sendEvent("click_plus_game_from_left_panel");
                  }}
                >
                  <div className="w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary">
                    <PlusIcon />
                  </div>
                </NavLink>
              ) : null}
            </div>
            {chatLogs.filter((log) => log.type === "you_are_the_hero")
              .length === 0 ? (
              <NavLink
                to="/game/new"
                onClick={
                  isSmallScreen ? () => dispatch(toggleLeftPanel()) : undefined
                }
              >
                <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
                    <PlusIcon />
                  </div>
                  <span className="pl-[10px]">{t("New game")}</span>
                </div>
              </NavLink>
            ) : (
              chatLogs
                .filter((log) => log.type === "you_are_the_hero")
                .map((game) => (
                  <div
                    key={game.threadId}
                    className="group flex flex-row justify-between items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]"
                  >
                    <NavLink
                      to={`/game/${game.threadId}`}
                      key={game.threadId}
                      className="h-full grow flex items-center w-[calc(100%-40px)]"
                      onClick={
                        isSmallScreen
                          ? () => dispatch(toggleLeftPanel())
                          : undefined
                      }
                    >
                      {/* <div className={clsx("h-[24px] w-[24px]")}>
                        <img
                          src={
                            games.find((g) => g.id === char.threadId)
                              ?.imagesMultisize?.[0]?.small ??
                            characters.find((c) => c.threadId === char.threadId)
                              ?.images?.[0] ??
                            imageDani
                          }
                          className="rounded-full h-[24px] w-[24px] object-cover"
                        />
                      </div> */}
                      <div className="truncate grow">{t(game.title ?? "")}</div>
                    </NavLink>
                    {game.isBeingDeleted ? (
                      <div className="h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary">
                        <LoadingIcon />
                      </div>
                    ) : (
                      <div
                        className={clsx(
                          {
                            hidden: displayOptionDropdownId !== game.threadId,
                          },
                          "group-hover:block cursor-pointer ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"
                        )}
                        onClick={(event) =>
                          handleDropdownClick(event, game.threadId)
                        }
                      >
                        <OptionsIcon />
                      </div>
                    )}

                    {displayOptionDropdownId === game.threadId &&
                      dropdownPosition && (
                        <div
                          style={{
                            position: "fixed",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                          }}
                          className="z-20"
                        >
                          <OptionsDropdown
                            type="you_are_the_hero"
                            threadId={game.threadId}
                            hide={() => setDisplayOptionDropdownId(null)}
                          />
                        </div>
                      )}
                  </div>
                ))
            )}
          </div>
          <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
            <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
              <div className="font-bold h-[40px] content-center">
                {t("Stories")}
              </div>
              {chatLogs.filter((log) => log.type === "story").length > 0 ? (
                <NavLink
                  to="/story/new"
                  onClick={() => {
                    if (isSmallScreen && isLeftPanelOpen)
                      dispatch(toggleLeftPanel());
                    sendEvent("click_plus_story_from_left_panel");
                  }}
                >
                  <div className="w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary">
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
                <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
                  <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
                    <PlusIcon />
                  </div>
                  <span className="pl-[10px]">{t("New story")}</span>
                </div>
              </NavLink>
            ) : (
              chatLogs
                .filter((log) => log.type === "story")
                .map((story) => (
                  <div
                    key={story.threadId}
                    className="group flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]"
                  >
                    <NavLink
                      to={`/story/${story.threadId}`}
                      key={story.threadId}
                      className="h-full grow flex items-center w-[calc(100%-40px)]"
                      onClick={
                        isSmallScreen
                          ? () => dispatch(toggleLeftPanel())
                          : undefined
                      }
                    >
                      <div className="truncate">{t(story.title ?? "")}</div>
                    </NavLink>
                    {story.isBeingDeleted ? (
                      <div className="h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary">
                        <LoadingIcon />
                      </div>
                    ) : (
                      <div
                        className={clsx(
                          {
                            hidden: displayOptionDropdownId !== story.threadId,
                          },
                          "group-hover:block cursor-pointer  ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"
                        )}
                        onClick={(event) =>
                          handleDropdownClick(event, story.threadId)
                        }
                      >
                        <OptionsIcon />
                      </div>
                    )}

                    {displayOptionDropdownId === story.threadId &&
                      dropdownPosition && (
                        <div
                          style={{
                            position: "fixed",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                          }}
                          className="z-20"
                        >
                          <OptionsDropdown
                            type="story"
                            threadId={story.threadId}
                            hide={() => setDisplayOptionDropdownId(null)}
                          />
                        </div>
                      )}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
