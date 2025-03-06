import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { useAppSelector } from "../../store/hooks";

const CreateChatGroup: React.FC = () => {
  const { t } = useTranslation();
  const { isSmallScreen } = useAppSelector((state) => state.app);
  const navigate = useNavigate();

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
    <div className="w-full max-w-md p-6 bg-white dark:bg-darkMainSurfaceSecondary rounded-lg shadow">
      <div className="text-xl font-semibold mb-6">
        {t("Create a New Chat Group")}
      </div>
      <form onSubmit={handleSubmit}>
        {/* Group Name */}
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium mb-1">
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
  );
};

export default CreateChatGroup;
