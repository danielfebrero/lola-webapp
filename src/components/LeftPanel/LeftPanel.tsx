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
import { toggleLeftPanel, setMode } from "../../store/features/app/appSlice";
import useNewChatLocation from "../../hooks/useNewChatLocation";
import OptionsDropdown from "../OptionsDropdown";
import useClickOutside from "../../hooks/useClickOutside";
import useGA from "../../hooks/useGA";
import AdultIcon from "../../icons/adult";
import Loading from "../Loading";
import PlanIcon from "../../icons/plan";

// Common Components
const SectionHeader = ({
  title,
  showAddButton,
  onAddClick,
}: {
  title: string;
  showAddButton: boolean;
  onAddClick?: {
    path: string;
    onClick: () => void;
  };
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-bold h-[40px] content-center flex flex-row justify-between items-center">
      <div>{t(title)}</div>
      {showAddButton && onAddClick && (
        <NavLink to={onAddClick.path} onClick={onAddClick.onClick}>
          <div className="w-[24px] h-[24px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary">
            <PlusIcon />
          </div>
        </NavLink>
      )}
    </div>
  );
};

const EmptySection = ({
  title,
  path,
  onClick,
}: {
  title: string;
  path: string;
  onClick: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <NavLink to={path} onClick={onClick}>
      <div className="flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
        <div className="h-[20px] w-[20px] text-textSecondary dark:text-darkTextSecondary">
          <PlusIcon />
        </div>
        <span className="pl-[10px]">{t(title)}</span>
      </div>
    </NavLink>
  );
};

const NavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="group flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
      <NavLink
        to={to}
        className="h-full grow flex items-center w-[calc(100%-40px)]"
        onClick={onClick}
      >
        <div className="truncate">{t(label)}</div>
      </NavLink>
    </div>
  );
};

// Section Components
const ExploreSection = ({ onNavigate }: { onNavigate: () => void }) => {
  const { sendEvent } = useGA();

  return (
    <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
      <SectionHeader title="Explore" showAddButton={false} />

      <NavItem
        to="/explore/characters/latest"
        label="Characters"
        onClick={() => {
          onNavigate();
          sendEvent("click_explore_characters", "left_panel");
        }}
      />

      <NavItem
        to="/explore/stories/latest"
        label="Stories"
        onClick={() => {
          onNavigate();
          sendEvent("click_explore_stories", "left_panel");
        }}
      />

      <NavItem
        to="/explore/images"
        label="Images"
        onClick={() => {
          onNavigate();
          sendEvent("click_explore_images", "left_panel");
        }}
      />
    </div>
  );
};

// Section Components
const SocialSection = ({ onNavigate }: { onNavigate: () => void }) => {
  const { sendEvent } = useGA();

  return (
    <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
      <SectionHeader title="Social" showAddButton={false} />

      <NavItem
        to="/social/chat"
        label="Chat"
        onClick={() => {
          onNavigate();
          sendEvent("click_group_chat", "left_panel");
        }}
      />

      <NavItem
        to="/social/story"
        label="Collaborative stories"
        onClick={() => {
          onNavigate();
          sendEvent("click_group_chat", "left_panel");
        }}
      />
    </div>
  );
};

const ContentSection = ({
  title,
  type,
  items,
  isLoading,
  onNavigate,
  onHandleDropdown,
  displayOptionDropdownId,
  dropdownPosition,
  setDisplayOptionDropdownId,
  characters,
}: {
  title: string;
  type: string;
  items: any[];
  isLoading: boolean;
  onNavigate: () => void;
  onHandleDropdown: (event: React.MouseEvent, threadId: string) => void;
  displayOptionDropdownId: string | null;
  dropdownPosition: { top: number; left: number } | null;
  setDisplayOptionDropdownId: (threadId: string | null) => void;
  characters?: any[];
}) => {
  const { t } = useTranslation();
  const { sendEvent } = useGA();
  const dispatch = useAppDispatch();
  const { isSmallScreen } = useAppSelector((state) => state.app);

  const newPath = `/${type}/new`;
  const detailPath = `/${type}/`;

  const handleAdd = () => {
    if (isSmallScreen) dispatch(toggleLeftPanel());
    sendEvent(`click_new_${type}`, "left_panel");
  };

  if (isLoading) {
    return (
      <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
        <SectionHeader
          title={title}
          showAddButton={items.length > 0}
          onAddClick={{ path: newPath, onClick: handleAdd }}
        />
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-auto w-full flex flex-col ml-[10px] pr-[20px]">
      <SectionHeader
        title={title}
        showAddButton={items.length > 0}
        onAddClick={{ path: newPath, onClick: handleAdd }}
      />

      {items.length === 0 ? (
        <EmptySection
          title={`New ${type}`}
          path={newPath}
          onClick={handleAdd}
        />
      ) : (
        items.map((item) => (
          <ContentItem
            key={item.threadId}
            item={item}
            type={type}
            detailPath={detailPath}
            onHandleDropdown={onHandleDropdown}
            displayOptionDropdownId={displayOptionDropdownId}
            dropdownPosition={dropdownPosition}
            setDisplayOptionDropdownId={setDisplayOptionDropdownId}
            characters={characters}
          />
        ))
      )}
    </div>
  );
};

const ContentItem = ({
  item,
  type,
  detailPath,
  onHandleDropdown,
  displayOptionDropdownId,
  dropdownPosition,
  setDisplayOptionDropdownId,
  characters,
}: {
  item: any;
  type: string;
  detailPath: string;
  onHandleDropdown: (event: React.MouseEvent, threadId: string) => void;
  displayOptionDropdownId: string | null;
  dropdownPosition: { top: number; left: number } | null;
  setDisplayOptionDropdownId: (threadId: string | null) => void;
  characters?: any[];
}) => {
  const { t } = useTranslation();
  const { isSmallScreen } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const handleClick = isSmallScreen
    ? () => dispatch(toggleLeftPanel())
    : undefined;

  return (
    <div className="group flex flex-row items-center hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer pl-[10px] pr-[10px] ml-[-10px] mr-[-10px] h-[40px]">
      <NavLink
        to={`${detailPath}${item.threadId}`}
        className="h-full grow flex items-center w-[calc(100%-40px)]"
        onClick={handleClick}
      >
        {type === "character" && (
          <div className="flex flex-row">
            <div
              className={clsx(
                {
                  "bg-gray-200 rounded-full":
                    characters?.find((c) => c.thread_id === item.threadId)
                      ?.imagesMultisize?.[0]?.small === undefined,
                },
                "h-[24px] w-[24px]"
              )}
            >
              {characters?.find((c) => c.thread_id === item.threadId)
                ?.imagesMultisize?.[0] && (
                <img
                  src={
                    characters.find((c) => c.thread_id === item.threadId)
                      ?.avatar?.small ??
                    characters.find((c) => c.thread_id === item.threadId)
                      ?.imagesMultisize?.[0]?.small
                  }
                  className="rounded-full h-[24px] w-[24px] object-cover"
                  alt="Character"
                />
              )}
            </div>
            <span className="pl-[10px] truncate">
              {t(
                characters?.find((c) => c.thread_id === item.threadId)?.json
                  ?.name ??
                  item.title ??
                  ""
              )}
            </span>
          </div>
        )}

        {type !== "character" && (
          <div className="truncate">{t(item.title ?? "")}</div>
        )}
      </NavLink>

      {item.isBeingDeleted || item.isBeingArchived ? (
        <div className="h-[24px] w-[24px] text-textSecondar dark:text-darkTextSecondary">
          <LoadingIcon />
        </div>
      ) : (
        <div
          className={clsx(
            {
              hidden: displayOptionDropdownId !== item.threadId,
            },
            "group-hover:block cursor-pointer ml-[5px] h-[24px] w-[24px] text-textSecondary dark:text-darkTextSecondary"
          )}
          onClick={(event) => onHandleDropdown(event, item.threadId)}
        >
          <OptionsIcon />
        </div>
      )}

      {displayOptionDropdownId === item.threadId && dropdownPosition && (
        <div
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
          }}
          className="z-20"
        >
          <OptionsDropdown
            type={type}
            threadId={item.threadId}
            hide={() => setDisplayOptionDropdownId(null)}
          />
        </div>
      )}
    </div>
  );
};

const FooterLinks = () => {
  const { t } = useTranslation();
  const { sendEvent } = useGA();
  const dispatch = useAppDispatch();
  const { isSmallScreen, isLeftPanelOpen, mode } = useAppSelector(
    (state) => state.app
  );
  const { plan } = useAppSelector((state) => state.user);

  const handleUpgradeClick = () => {
    sendEvent("click_upgrade", "left_panel");
    if (isSmallScreen && isLeftPanelOpen) dispatch(toggleLeftPanel());
  };

  const handleModeToggle = () => {
    dispatch(setMode(mode === "adult" ? "minor" : "adult"));
    sendEvent(
      mode === "adult"
        ? "click_exit_lola18_from_left_panel"
        : "click_enter_lola18_from_left_panel"
    );
    if (isSmallScreen && isLeftPanelOpen) dispatch(toggleLeftPanel());
  };

  return (
    <>
      {plan !== "early_lifetime" && (
        <NavLink
          onClick={handleUpgradeClick}
          to="/pricing"
          className="absolute bottom-[55px] left-[10px] pl-[10px] flex flex-row cursor-pointer hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary w-[240px] py-[10px] rounded-lg"
        >
          <div className="w-[24px] h-[24px] mr-[10px]">
            <PlanIcon />
          </div>
          <div>{t("Upgrade plan")}</div>
        </NavLink>
      )}

      <div
        onClick={handleModeToggle}
        className="absolute bottom-[10px] left-[10px] pl-[10px] dark:text-pink-200 text-rose-600 flex flex-row cursor-pointer hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary w-[240px] py-[10px] rounded-lg"
      >
        <div className="w-[24px] h-[24px] mr-[10px]">
          <AdultIcon />
        </div>
        <div>
          {t(mode === "minor" ? "Enter Fabularius" : "Exit Fabularius")}
        </div>
      </div>
    </>
  );
};

// Main Component
const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { sendEvent } = useGA();
  const newChatLocation = useNewChatLocation();
  const [displayOptionDropdownId, setDisplayOptionDropdownId] = useState<
    string | null
  >(null);
  const [clickedElement, setClickedElement] = useState<DOMRect | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const {
    isLeftPanelOpen,
    chatLogs,
    characters,
    isSmallScreen,
    isDataLoadingLeftPanel,
  } = useAppSelector((state) => state.app);

  const outsideRef = useClickOutside(() =>
    isLeftPanelOpen && isSmallScreen ? dispatch(toggleLeftPanel()) : null
  );

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

  const handlePanelNavigate = () => {
    if (isSmallScreen && isLeftPanelOpen) dispatch(toggleLeftPanel());
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

  const characterItems = chatLogs.filter(
    (log) => log.type === "character" && log.isOwner
  );

  const storyItems = chatLogs.filter(
    (log) => log.type === "story" && log.isOwner
  );

  const gameItems = chatLogs.filter((log) => log.type === "you_are_the_hero");

  return (
    <div
      ref={outsideRef}
      className={clsx(
        {
          "min-w-[260px] w-[260px]": isLeftPanelOpen,
          "min-w-0 w-0": !isLeftPanelOpen,
        },
        `relative transition-all duration-500 h-screen-real bg-lightGray dark:bg-darkLightGray`
      )}
    >
      <div className="h-screen-real w-[260px] flex flex-col pl-[20px] pr-[20px] pt-[10px]">
        {/* Header */}
        <div className="h-auto w-full flex flex-col">
          <div className="font-bold h-[40px] items-center flex flex-row justify-between text-textSecondary dark:text-darkTextSecondary">
            <div
              onClick={() => {
                dispatch(toggleLeftPanel());
                sendEvent("click_toggle_left_panel", "left_panel");
              }}
            >
              <div className="ml-[-5px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary">
                <div className="h-[24px] w-[24px]">
                  <PanelIcon />
                </div>
              </div>
            </div>
            <NavLink
              to={newChatLocation}
              onClick={() => {
                if (isSmallScreen && isLeftPanelOpen)
                  dispatch(toggleLeftPanel());
                sendEvent("click_new_chat", "left_panel");
              }}
            >
              <div className="mr-[-5px] hover:bg-gray-200 dark:hover:bg-darkMainSurfacePrimary rounded-lg cursor-pointer p-[5px] text-textSecondary dark:text-darkTextSecondary">
                <div className="h-[24px] w-[24px]">
                  <NewChatIcon />
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Main Content */}
        <div
          ref={scrollRef}
          className="h-[calc(100%-150px)] w-[calc(100%+20px)] flex flex-col overflow-y-scroll overflow-x-clip ml-[-10px] mr-[-10px] no-scrollbar"
        >
          <ExploreSection onNavigate={handlePanelNavigate} />
          <SocialSection onNavigate={handlePanelNavigate} />

          <ContentSection
            title="Characters"
            type="character"
            items={characterItems}
            isLoading={isDataLoadingLeftPanel.includes("threads")}
            onNavigate={handlePanelNavigate}
            onHandleDropdown={handleDropdownClick}
            displayOptionDropdownId={displayOptionDropdownId}
            dropdownPosition={dropdownPosition}
            setDisplayOptionDropdownId={setDisplayOptionDropdownId}
            characters={characters}
          />

          <ContentSection
            title="Stories"
            type="story"
            items={storyItems}
            isLoading={isDataLoadingLeftPanel.includes("threads")}
            onNavigate={handlePanelNavigate}
            onHandleDropdown={handleDropdownClick}
            displayOptionDropdownId={displayOptionDropdownId}
            dropdownPosition={dropdownPosition}
            setDisplayOptionDropdownId={setDisplayOptionDropdownId}
          />

          <ContentSection
            title="Games"
            type="game"
            items={gameItems}
            isLoading={isDataLoadingLeftPanel.includes("threads")}
            onNavigate={handlePanelNavigate}
            onHandleDropdown={handleDropdownClick}
            displayOptionDropdownId={displayOptionDropdownId}
            dropdownPosition={dropdownPosition}
            setDisplayOptionDropdownId={setDisplayOptionDropdownId}
          />
        </div>
      </div>

      <FooterLinks />
    </div>
  );
};

export default LeftPanel;
