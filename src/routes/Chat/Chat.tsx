import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";

import Meta from "../../components/Meta";
import { useAppSelector } from "../../store/hooks";
import Chat from "../../components/Chat";
import CreateChatGroup from "./CreateChatGroup";
import { useEffect, useRef } from "react";
import useAutoScroll from "../../hooks/useAutoScroll";

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
    title: "Very long title what is this title that is so long",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
    id: "1",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
    id: "1",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
    id: "1",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
    id: "1",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
    id: "1",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
    id: "1",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    id: "1",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    title: "General",
    id: "1",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    id: "1",
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    id: "1",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    title: "General",
    id: "1",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    id: "1",
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    title: "General",
    id: "1",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    id: "1",
    title: "General",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    title: "General",
    id: "1",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
  {
    title: "General",
    id: "1",
    dateLastMessage: "2021-09-01T00:00:00.000Z",
    profileImage: "https://randomuser.me/api/portraits",
  },
];

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { isSmallScreen } = useAppSelector((state) => state.app);
  const { autoScroll } = useAutoScroll(chatContainerRef);

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
        <div className="grow flex flex-row h-[calc(100vh-110px)] max-w-full">
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
            {convos.map((convo, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row m-2 p-2 hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary cursor-pointer rounded-lg"
                  onClick={() => navigate(`/social/chat/${convo.id}`)}
                >
                  <div className="w-[50px] h-[50px] rounded-full bg-black">
                    <img src={convo.profileImage} alt="" />
                  </div>
                  <div className="flex flex-col ml-[10px]">
                    <div
                      className={clsx(
                        {
                          "w-[220px]": !isSmallScreen,
                          "w-[calc(100vw-100px)]": isSmallScreen,
                        },
                        "truncate"
                      )}
                    >
                      {convo.title}
                    </div>
                    <div className="text-textSecondary dark:text-darkTextSecondary text-xs">
                      {moment(convo.dateLastMessage).fromNow()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!params.threadId && !isSmallScreen && (
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="text-textSecondary dark:text-darkTextSecondary">
                {t("Select a chat or create a new chat to start messaging")}
              </div>
            </div>
          )}
          {params.threadId === "new" && (
            <div className="flex flex-col items-center justify-center flex-grow min-w-0 p-[10px]">
              <CreateChatGroup />
            </div>
          )}
          {params.threadId && params.threadId !== "new" && (
            <div
              ref={chatContainerRef}
              className="flex flex-col flex-grow overflow-y-scroll no-scrollbar"
            >
              <Chat
                chatLog={chatLog}
                isChatLoading={false}
                isAssistantWriting={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
