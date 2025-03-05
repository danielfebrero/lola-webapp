import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNavigate, useParams } from "react-router";

import Meta from "../../components/Meta";

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
  return (
    <>
      <Meta title={t("Chat")} />
      <div className="grow pt-2.5 pb-2.5 flex flex-row">
        <div className="grow flex flex-row h-[calc(100vh-110px)] max-w-full">
          <div className="flex flex-col w-[320px] h-full md:block hidden border-r border-borderColor dark:border-darkBorderColor overflow-y-scroll no-scrollbar">
            {convos.map((convo) => {
              return (
                <div
                  className="flex flex-row m-2 p-2 hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary cursor-pointer rounded-lg"
                  onClick={() => navigate(`/collaborate/chat/${convo.id}`)}
                >
                  <div className="w-[50px] h-[50px] rounded-full bg-black">
                    <img src={convo.profileImage} alt="" />
                  </div>
                  <div className="flex flex-col ml-[10px]">
                    <div className="w-[220px] truncate">{convo.title}</div>
                    <div className="text-textSecondary dark:text-darkTextSecondary text-xs">
                      {moment(convo.dateLastMessage).fromNow()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!params.threadId && (
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="text-textSecondary dark:text-darkTextSecondary">
                {t("Select a chat to start messaging")}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
