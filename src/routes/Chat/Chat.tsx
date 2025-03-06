import { useTranslation } from "react-i18next";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

import Meta from "../../components/Meta";
import { useAppSelector } from "../../store/hooks";
import clsx from "clsx";

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

  const { isSmallScreen } = useAppSelector((state) => state.app);

  // Form state for new chat
  const [groupName, setGroupName] = useState("");
  const [participant, setParticipant] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [participation, setParticipation] = useState<
    "onlyMe" | "participants" | "custom" | "everyone"
  >("participants");

  // Email handling functions
  const addParticipant = () => {
    if (participant && !participants.includes(participant)) {
      setParticipants([...participants, participant]);
      setParticipant("");
    }
  };

  const removeParticipant = (emailToRemove: string) => {
    setParticipants(participants.filter((e) => e !== emailToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ groupName, participants, isPublic, participation });
    // Here you would handle the creation of a new chat
    // and navigate to the new chat thread
  };

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
                {t("Select a chat to start messaging")}
              </div>
            </div>
          )}
          {params.threadId === "new" && (
            <div className="flex flex-col items-center justify-center flex-grow min-w-0 p-[10px]">
              <div className="w-full max-w-md p-6 bg-white dark:bg-darkMainSurfaceSecondary rounded-lg shadow">
                <div className="text-xl font-semibold mb-6">
                  {t("Create a New Chat Group")}
                </div>
                <form onSubmit={handleSubmit}>
                  {/* Group Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-medium mb-1"
                    >
                      {t("Group Name")}
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full px-3 py-2 border border-borderColor dark:border-darkBorderColor dark:bg-darkBrandMainColorDarker bg-brandMainColorDarker rounded-md focus:outline-none focus:ring-0"
                      placeholder={t("Enter a name for your group")}
                      required
                    />
                  </div>

                  {/* Humans (Add Emails) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {t("Add Participants")}
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={participant}
                        onChange={(e) => setParticipant(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addParticipant();
                          }
                        }}
                        className="w-full px-3 py-2 border border-borderColor dark:border-darkBorderColor dark:bg-darkBrandMainColorDarker bg-brandMainColorDarker rounded-l-md focus:outline-none focus:ring-0"
                        placeholder={t("Enter email address or username")}
                      />
                      <button
                        type="button"
                        onClick={addParticipant}
                        className="px-4 py-2 bg-brandMainColor dark:bg-darkBrandMainColor text-white rounded-r-md hover:bg-brandMainColorHover dark:hover:bg-darkBrandMainColorHover"
                      >
                        {t("Add")}
                      </button>
                    </div>

                    {/* Email list */}
                    {participants.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {participants.map((p, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded"
                          >
                            <span className="text-sm">{p}</span>
                            <button
                              type="button"
                              onClick={() => removeParticipant(p)}
                              className="text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Who can send messages? */}
                  <div className="mb-4">
                    <span className="block text-sm font-medium mb-1">
                      {t("Who can send messages?")}
                    </span>
                    <div
                      className={clsx(
                        {
                          "grid-cols-1": isSmallScreen,
                          "grid-cols-3": !isSmallScreen,
                        },
                        "grid gap-2"
                      )}
                    >
                      <label className="inline-flex items-center p-2 border border-borderColor dark:border-darkBorderColor rounded-md cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary">
                        <input
                          type="radio"
                          checked={participation === "onlyMe"}
                          onChange={() => setParticipation("onlyMe")}
                          className="form-radio text-brandMainColor"
                          name="participation"
                        />
                        <span className="ml-2">{t("Only me")}</span>
                      </label>
                      <label className="inline-flex items-center p-2 border border-borderColor dark:border-darkBorderColor rounded-md cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary">
                        <input
                          type="radio"
                          checked={participation === "participants"}
                          onChange={() => setParticipation("participants")}
                          className="form-radio text-brandMainColor"
                          name="participation"
                        />
                        <span className="ml-2">{t("Participants")}</span>
                      </label>
                      <label className="inline-flex items-center p-2 border border-borderColor dark:border-darkBorderColor rounded-md cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary">
                        <input
                          type="radio"
                          checked={participation === "everyone"}
                          onChange={() => setParticipation("everyone")}
                          className="form-radio text-brandMainColor"
                          name="participation"
                        />
                        <span className="ml-2">{t("Everyone")}</span>
                      </label>
                    </div>
                  </div>

                  {/* Public/Private Toggle */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium mb-1">
                      {t("Visibility")}
                    </span>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={!isPublic}
                          onChange={() => setIsPublic(false)}
                          className="form-radio"
                          name="visibility"
                        />
                        <span className="ml-2">{t("Private")}</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={isPublic}
                          onChange={() => setIsPublic(true)}
                          className="form-radio"
                          name="visibility"
                        />
                        <span className="ml-2">{t("Public")}</span>
                      </label>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/social/chat")}
                      className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brandMainColor dark:bg-darkBrandMainColor text-white rounded-md hover:bg-brandMainColorHover dark:hover:bg-darkBrandMainColorHover"
                    >
                      {t("Create")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
