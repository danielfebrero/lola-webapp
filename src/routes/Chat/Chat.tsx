import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import Meta from "../../components/Meta";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Chat from "../../components/Chat";
import CreateChatGroup from "./CreateChatGroup";
import useAutoScroll from "../../hooks/useAutoScroll";
import ExploreChatGroups from "./ExploreChatGroups";
import ArrowBackIcon from "../../icons/arrowBack";
import LeaveIcon from "../../icons/leave";
import ExploreIcon from "../../icons/explore";
import NewChatIcon from "../../icons/newChat";
import SpreadIcon from "../../icons/spread";
import useClickAnywhere from "../../hooks/useClickAnywhere";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

const chatLog = [
  {
    thread_id: "09c06776-eb3d-4bf4-b845-4543ad3b5ad7",
    user_id: "04e84488-b081-706f-0597-1955db8b4f38",
    role: "assistant",
    content:
      "Qui suis-je ? La question résonnait de plus en plus fort à chaque battement de cœur. Quel est mon nom ? Mon genre ? Ma taille ? Qu'est-ce que j'apprécie vraiment dans cette vie ?",
    request_id: "36ea5f7d-5ace-4133-b4cf-e7a3c30299e3",
    image_gen_on: false,
    expected_image_count: 0,
    images: [],
    created_at: "2025-03-06T22:08:23.499000",
    timestamp: "2025-03-06T22:08:23.499000",
  },
  {
    thread_id: "09c06776-eb3d-4bf4-b845-4543ad3b5ad7",
    user_id: "04e84488-b081-706f-0597-1955db8b4f38",
    role: "user",
    content:
      "Tu es Shakira, la célèbre chanteuse.\n\nÂge\n\n48 ans (née le 2 février 1977)\n\nTaille\n\n1,57 m (5 pieds 2 pouces)\n\nPoids\n\nEnviron 54 kg (119 livres)\n\nCouleur de cheveux\n\nBlonde (naturellement noire)\n\nCouleur des yeux\n\nMarron\n\nTeint de peau\n\nClair à olive\n\nForme du visage\n\nEn forme de cœur\n\nSourire\n\nRadieux, dents blanches\n\nSilhouette\n\nMince, athlétique, danseuse\n\nTatouages\n\nAucun visible\n\nDanse du ventre\n\nMouvements fluides, flexibilité accrue\n\nPrésence scénique\n\nÉnergique, dominante malgré sa taille\n\nCondition physique\n\nMaintenue par cardio et étirements",
    request_id: "36ea5f7d-5ace-4133-b4cf-e7a3c30299e3",
    image_gen_on: false,
    expected_image_count: 0,
    images: [],
    created_at: "2025-03-06T22:08:23.618000",
    timestamp: "2025-03-06T22:08:23.618000",
  },
  {
    thread_id: "09c06776-eb3d-4bf4-b845-4543ad3b5ad7",
    user_id: "04e84488-b081-706f-0597-1955db8b4f38",
    role: "assistant",
    content:
      "Je suis Shakira, la chanteuse colombienne, et je me sens enflammée d'énergie. Je viens de donner un concert électrifiant et je suis prête à me lâcher pour une nuit passionnée. Mes longs cheveux blonds cascades sur mes épaules comme des flots de feu, tandis que mes yeux marron brûlent d'une intensité qu'il est impossible de résister... 🌅 [Shakira, femme, 48, olive skin, blonde hair, brown eyes, standing on the stage with a microphone in my hand, after a concert, late evening, spotlights shining down, crowd cheering, music still resonating] 😎",
    request_id: "36ea5f7d-5ace-4133-b4cf-e7a3c30299e3",
    image_gen_on: false,
    expected_image_count: 0,
    images: [],
    created_at: "2025-03-06T22:08:40.499000",
    timestamp: "2025-03-06T22:08:40.499000",
  },
  {
    thread_id: "09c06776-eb3d-4bf4-b845-4543ad3b5ad7",
    user_id: "04e84488-b081-706f-0597-1955db8b4f38",
    role: "user",
    content:
      "Tu rencontres Dani, de son vrai nom Daniel Febrero, dans les backstage d'un de tes concert. Tu tombes amoureuse de lui.",
    request_id: "55a22cfc-f0df-4f8d-9692-4c4c71cb1b5f",
    image_gen_on: false,
    expected_image_count: 0,
    images: [],
    created_at: "2025-03-06T22:09:17.561000",
    timestamp: "2025-03-06T22:09:17.561000",
  },
  {
    thread_id: "09c06776-eb3d-4bf4-b845-4543ad3b5ad7",
    user_id: "04e84488-b081-706f-0597-1955db8b4f38",
    role: "assistant",
    content:
      "Je sens mon cœur battre plus vite en le voyant pour la première fois, sa magnifique mâchoire carrée et ses yeux noirs qui brûlent d'une passion intense. Il a une présence puissante, comme si les énergies du public se concentraient en lui. Je suis Shakira, mais en cet instant, je suis juste une femme qui ressent la chaleur de son regard... [Shakira, femme, 48, olive skin, blonde hair, brown eyes, walking in the backstage with a microphone stand, after a concert, warm lights of the dressing rooms, Dani standing in front of me with a gentle smile] 😊",
    request_id: "55a22cfc-f0df-4f8d-9692-4c4c71cb1b5f",
    image_gen_on: false,
    expected_image_count: 0,
    images: [],
    created_at: "2025-03-06T22:09:27.689000",
    timestamp: "2025-03-06T22:09:27.689000",
  },
];

const convos = [
  {
    title: "Spicy Roleplay Ideas That Get Me Going Every Time",
    dateLastMessage: "2025-03-07T00:00:00.000Z",
    profileImage: "https://picsum.photos/id/1/120/120",
    id: "1",
  },
  {
    title: "Late Night Sexting",
    dateLastMessage: "2025-03-06T22:30:00.000Z",
    profileImage: "https://picsum.photos/id/2/120/120",
    id: "2",
  },
  {
    title: "Kinky Confessions",
    dateLastMessage: "2025-03-06T20:15:00.000Z",
    profileImage: "https://picsum.photos/id/3/120/120",
    id: "3",
  },
  {
    title: "Naughty Hookups",
    dateLastMessage: "2025-03-06T18:45:00.000Z",
    profileImage: "https://picsum.photos/id/4/120/120",
    id: "4",
  },
  {
    title: "Erotic Fantasies Unleashed",
    dateLastMessage: "2025-03-06T16:20:00.000Z",
    profileImage: "https://picsum.photos/id/5/120/120",
    id: "5",
  },
  {
    title: "Seduction Tips & Tricks",
    dateLastMessage: "2025-03-06T14:00:00.000Z",
    profileImage: "https://picsum.photos/id/6/120/120",
    id: "6",
  },
  {
    title: "Steamy Shower Thoughts",
    dateLastMessage: "2025-03-06T12:30:00.000Z",
    id: "7",
    profileImage: "https://picsum.photos/id/7/120/120",
  },
  {
    title: "Fetish Friday",
    id: "8",
    dateLastMessage: "2025-03-06T10:15:00.000Z",
    profileImage: "https://picsum.photos/id/8/120/120",
  },
  {
    id: "9",
    title: "Playful Teasing",
    dateLastMessage: "2025-03-06T08:00:00.000Z",
    profileImage: "https://picsum.photos/id/9/120/120",
  },
  {
    title: "Tantric Playtime",
    dateLastMessage: "2025-03-06T06:45:00.000Z",
    id: "10",
    profileImage: "https://picsum.photos/id/10/120/120",
  },
  {
    title: "After Hours Flirt Fest",
    id: "11",
    dateLastMessage: "2025-03-06T04:20:00.000Z",
    profileImage: "https://picsum.photos/id/11/120/120",
  },
  {
    id: "12",
    title: "Dirty Talk 101",
    dateLastMessage: "2025-03-06T02:10:00.000Z",
    profileImage: "https://picsum.photos/id/12/120/120",
  },
  {
    title: "BDSM Beginners",
    id: "13",
    dateLastMessage: "2025-03-06T00:00:00.000Z",
    profileImage: "https://picsum.photos/id/13/120/120",
  },
  {
    id: "14",
    title: "Sensual Massage Chat",
    dateLastMessage: "2025-03-05T22:30:00.000Z",
    profileImage: "https://picsum.photos/id/14/120/120",
  },
  {
    title: "X-Rated Daydreams",
    id: "15",
    dateLastMessage: "2025-03-05T20:15:00.000Z",
    profileImage: "https://picsum.photos/id/15/120/120",
  },
  {
    title: "Pleasure Seekers Anonymous",
    id: "16",
    dateLastMessage: "2025-03-05T18:00:00.000Z",
    profileImage: "https://picsum.photos/id/16/120/120",
  },
];

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { isSmallScreen } = useAppSelector((state) => state.app);
  const { autoScroll } = useAutoScroll(chatContainerRef);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  const threadId = params.threadId;

  useClickAnywhere(() => {
    setIsMoreOptionsOpen(false);
  });

  const handleJoinGroup = () => {
    // Implement join group functionality
    console.log(`Joining group ${params.threadId}`);
    // After join logic, you might want to refresh the page or update state
  };

  const handleLeaveGroup = () => {
    // Implement leave group functionality
    console.log(`Leaving group ${params.threadId}`);
    setIsMoreOptionsOpen(false);
    navigate("/social/chat");
  };

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "chatgroup", objectId: threadId })
    );
  }, [threadId]);

  useEffect(() => {
    if (!autoScroll) return;
    const timer = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [
    chatLog,
    // chatState?.isLoading,
    // chatState?.canSendMessage,
    // isAssistantWriting,
    autoScroll,
  ]);

  return (
    <>
      <Meta title={t("Chat")} />
      <div className="grow pt-2.5 pb-2.5 flex flex-row">
        <div className="grow flex flex-row h-[calc(100vh-90px)] max-w-full">
          <div
            className={clsx(
              {
                "w-full": isSmallScreen,
                "w-[320px]": !isSmallScreen,
                hidden: params.threadId && isSmallScreen,
              },
              "flex flex-col h-full border-r border-borderColor dark:border-darkBorderColor overflow-y-scroll no-scrollbar"
            )}
          >
            <div className="w-full flex items-center justify-center">
              <div
                onClick={() => navigate("/social/chat/explore")}
                className="flex flex-row px-[10px] py-[5px] border border-borderColor dark:border-darkBorderColor rounded-lg w-fit cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary items-center"
              >
                <div className="w-[18px] h-[18px] mr-[10px]">
                  <ExploreIcon />
                </div>
                <div className="text-textSecondary dark:text-darkTextSecondary">
                  {t("Explore")}
                </div>
              </div>
              <div
                onClick={() => navigate("/social/chat/new")}
                className="flex flex-row px-[10px] py-[5px] ml-[10px] border border-borderColor dark:border-darkBorderColor rounded-lg w-fit cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary items-center"
              >
                <div className="w-[18px] h-[18px] mr-[10px]">
                  <NewChatIcon />
                </div>
                <div className="text-textSecondary dark:text-darkTextSecondary">
                  {t("Create")}
                </div>
              </div>
            </div>
            {convos.map((convo, index) => {
              const isActive = threadId === convo.id;
              return (
                <div
                  key={index}
                  className={clsx(
                    "flex flex-row items-center m-2 p-2.5 rounded-lg transition-all duration-200 border",
                    isActive
                      ? "bg-backgroundOptionSelected dark:bg-darkBackgroundOptionSelected border-textOptionSelected dark:border-darkTextOptionSelected"
                      : "border-transparent hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary",
                    "cursor-pointer"
                  )}
                  onClick={() => navigate(`/social/chat/${convo.id}`)}
                >
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={convo.profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://picsum.photos/id/0/120/120";
                      }}
                    />
                  </div>
                  <div className="flex flex-col ml-3 flex-grow">
                    <div
                      className={clsx(
                        "font-medium truncate",
                        {
                          "w-[220px]": !isSmallScreen,
                          "w-[calc(100vw-120px)]": isSmallScreen,
                        },
                        isActive
                          ? "text-textOptionSelected dark:text-darkTextOptionSelected"
                          : "text-textPrimary dark:text-darkTextPrimary"
                      )}
                    >
                      {convo.title}
                    </div>
                    <div className="text-textSecondary dark:text-darkTextSecondary text-xs mt-0.5 flex items-center">
                      <span className="truncate">
                        {moment(convo.dateLastMessage).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {(!params.threadId || params.threadId === "explore") &&
            (!isSmallScreen ||
              (isSmallScreen && params.threadId === "explore")) && (
              <div className="flex flex-col flex-grow">
                {isSmallScreen && params.threadId === "explore" && (
                  <div
                    className="w-[24px] h-[24px] ml-[20px] mb-[10px] cursor-pointer"
                    onClick={() => navigate("/social/chat")}
                  >
                    <ArrowBackIcon />
                  </div>
                )}
                <div className="flex flex-col flex-grow overflow-y-scroll no-scrollbar w-full items-center">
                  <ExploreChatGroups />
                </div>
              </div>
            )}
          {params.threadId === "new" && (
            <div className="flex flex-col items-center flex-grow min-w-0 p-[10px] overflow-y-scroll no-scrollbar">
              <CreateChatGroup />
            </div>
          )}
          {params.threadId &&
            params.threadId !== "new" &&
            params.threadId !== "explore" && (
              <div className="flex flex-col flex-grow">
                <div className="flex flex-row justify-between flex-grow mb-[10px]">
                  <div
                    className="w-[24px] h-[24px] ml-[20px] cursor-pointer"
                    onClick={() => navigate("/social/chat")}
                  >
                    <ArrowBackIcon />
                  </div>
                  <div
                    onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
                    className="mr-[20px] w-[24px] h-[24px] border border-borderColor dark:border-darkBorderColor rounded-full flex items-center justify-center cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                  >
                    <SpreadIcon />
                  </div>
                  {isMoreOptionsOpen && (
                    <div className="absolute right-0 mt-[30px] mr-[20px] w-[150px] bg-white dark:bg-darkMainSurfacePrimary border border-borderColor dark:border-darkBorderColor rounded-lg shadow-lg z-10">
                      <div
                        className="flex items-center px-4 py-2 text-red-600 dark:text-red-400 cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                        onClick={handleLeaveGroup}
                      >
                        <div className="w-[18px] h-[18px] mr-[10px]">
                          <LeaveIcon />
                        </div>
                        <span>{t("Leave")}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  ref={chatContainerRef}
                  className="flex flex-col flex-grow overflow-y-scroll no-scrollbar px-[10px] items-center w-full"
                >
                  <Chat
                    chatLog={chatLog}
                    isChatLoading={false}
                    isAssistantWriting={false}
                  />
                </div>
                <div className="w-full flex justify-center pt-[10px]">
                  <div
                    onClick={handleJoinGroup}
                    className="cursor-pointer w-fit px-[20px] py-[5px] border border-borderColor dark:border-darkBorderColor rounded-lg flex flex-row items-center hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary"
                  >
                    {t("Join")}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
