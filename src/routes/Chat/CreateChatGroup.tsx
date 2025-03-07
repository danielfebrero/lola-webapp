import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import useAPI from "../../hooks/useAPI";
import {
  CharactersPariticipationType,
  PariticipationType,
} from "../../types/chatGroup";
import { setChatGroup, setThread } from "../../store/features/app/appSlice";
import TextInput from "../../components/TextInput";

const CreateChatGroup: React.FC = () => {
  const { t } = useTranslation();
  const { isSmallScreen } = useAppSelector((state) => state.app);
  const navigate = useNavigate();
  const { createChatGroup } = useAPI();
  const dispatch = useAppDispatch();

  // Form state for new chat
  const [groupName, setGroupName] = useState("");
  const [participant, setParticipant] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [participation, setParticipation] =
    useState<PariticipationType>("participants");
  const [charactersParticipation, setCharactersParticipation] =
    useState<CharactersPariticipationType>("automatically");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [characterSearch, setCharacterSearch] = useState("");

  // Get characters from store
  const { chatLogs, characters } = useAppSelector((state) => state.app);
  const availableCharacters = useMemo(() => {
    return chatLogs
      .filter((log) => log.type === "character" && log.isOwner)
      .map((log) => {
        const characterDetails = characters.find(
          (char) => char.thread_id === log.threadId
        );
        return {
          threadId: log.threadId,
          name: characterDetails?.name || log.title || "Unknown Character",
          avatar:
            characterDetails?.avatar || characterDetails?.imagesMultisize?.[0],
        };
      });
  }, [chatLogs, characters]);

  const filteredCharacters = useMemo(() => {
    return availableCharacters.filter((character) =>
      character.name.toLowerCase().includes(characterSearch.toLowerCase())
    );
  }, [availableCharacters, characterSearch]);

  const addCharacter = (characterId: string) => {
    if (!selectedCharacters.includes(characterId)) {
      setSelectedCharacters([...selectedCharacters, characterId]);
    }
  };

  const removeCharacter = (characterId: string) => {
    setSelectedCharacters(
      selectedCharacters.filter((id) => id !== characterId)
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chatGroupEntity = await createChatGroup({
      groupName,
      participants,
      characters: selectedCharacters,
      isPublic,
      participation,
      charactersParticipation,
    });
    dispatch(setThread(chatGroupEntity.thread));
    dispatch(setChatGroup(chatGroupEntity.chatGroup));
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
          <TextInput
            value={groupName}
            onChange={setGroupName}
            id="groupName"
            className="w-full"
            placeholder={t("Enter a name for your group")}
            required={true}
          />
        </div>

        {/* Humans (Add Emails) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("Add Participants")}
          </label>
          <div className="flex">
            <TextInput
              value={participant}
              onChange={setParticipant}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addParticipant();
                }
              }}
              className="w-full"
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

        {/* Characters */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("Add Characters")}
          </label>
          <div className="mb-2">
            <TextInput
              value={characterSearch}
              onChange={setCharacterSearch}
              className="w-full"
              placeholder={t("Search characters")}
            />
          </div>
          <div className="mt-2 h-48 overflow-y-auto border border-borderColor dark:border-darkBorderColor rounded-md">
            {filteredCharacters.length === 0 ? (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                {characterSearch
                  ? t("No characters match your search")
                  : t("No characters available")}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                {filteredCharacters.map((character) => (
                  <div
                    key={character.threadId}
                    className={clsx(
                      "flex items-center p-2 border rounded-md cursor-pointer",
                      selectedCharacters.includes(character.threadId)
                        ? "border-brandMainColor bg-blue-50 dark:bg-blue-900"
                        : "border-borderColor dark:border-darkBorderColor"
                    )}
                    onClick={() => {
                      if (selectedCharacters.includes(character.threadId)) {
                        removeCharacter(character.threadId);
                      } else {
                        addCharacter(character.threadId);
                      }
                    }}
                  >
                    {character.avatar ? (
                      <img
                        src={character.avatar.medium}
                        alt={character.name}
                        className="w-10 h-10 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 flex items-center justify-center">
                        <span className="text-gray-500">
                          {character.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm truncate">{character.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Characters will participate? */}
        <div className="mb-4">
          <span className="block text-sm font-medium mb-1">
            {t("When characters participate?")}
          </span>
          <div
            className={clsx(
              {
                "grid-cols-1": isSmallScreen,
                "grid-cols-2": !isSmallScreen,
              },
              "grid gap-2"
            )}
          >
            <label className="inline-flex items-center p-2 border border-borderColor dark:border-darkBorderColor rounded-md cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary">
              <input
                type="radio"
                checked={charactersParticipation === "automatically"}
                onChange={() => setCharactersParticipation("automatically")}
                className="form-radio text-brandMainColor"
                name="automatically"
              />
              <span className="ml-2">{t("Automatically")}</span>
            </label>

            <label className="inline-flex items-center p-2 border border-borderColor dark:border-darkBorderColor rounded-md cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary">
              <input
                type="radio"
                checked={charactersParticipation === "onMention"}
                onChange={() => setCharactersParticipation("onMention")}
                className="form-radio text-brandMainColor"
                name="onMention"
              />
              <span className="ml-2">{t("On mention")}</span>
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
            className="mr-2 px-4 py-2 border rounded-md hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary"
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
