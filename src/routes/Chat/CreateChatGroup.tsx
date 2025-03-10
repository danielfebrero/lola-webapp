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
import { Thread } from "../../types/chat";
import { Character } from "../../types/characters";
import { objectSnakeToCamel } from "../../utils/string";
import LoadingIcon from "../../icons/loading";

const MAX_CHARACTERS = 5;

const CreateChatGroup: React.FC = () => {
  const { t } = useTranslation();
  const { isSmallScreen, mode } = useAppSelector((state) => state.app);
  const navigate = useNavigate();
  const { createChatGroup, getUsersDetails } = useAPI();
  const dispatch = useAppDispatch();

  // Form state for new chat
  const [groupName, setGroupName] = useState("");
  const [participant, setParticipant] = useState("");
  const [participants, setParticipants] = useState<Record<string, any>>({});
  const [isPublic, setIsPublic] = useState(true);
  const [participation, setParticipation] =
    useState<PariticipationType>("participants");
  const [charactersParticipation, setCharactersParticipation] =
    useState<CharactersPariticipationType>("automatically");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [characterSearch, setCharacterSearch] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGroupCreating, setIsGroupCreating] = useState(false);

  // Get characters from store
  const { chatLogs, characters } = useAppSelector((state) => state.app);
  const availableCharacters = useMemo(() => {
    return chatLogs
      .filter(
        (log: Thread) =>
          log.type === "character" && log.isOwner && log.mode === mode
      )
      .map((log: Thread) => {
        const characterDetails = characters.find(
          (char: Character) => char.thread_id === log.threadId
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
      character.name?.toLowerCase().includes(characterSearch.toLowerCase())
    );
  }, [availableCharacters, characterSearch]);

  const addCharacter = (characterId: string) => {
    if (selectedCharacters.length >= MAX_CHARACTERS) {
      return;
    }

    if (!selectedCharacters.includes(characterId)) {
      setErrorMessage(null);
      setSelectedCharacters([...selectedCharacters, characterId]);
    }
  };

  const removeCharacter = (characterId: string) => {
    setErrorMessage(null);

    setSelectedCharacters(
      selectedCharacters.filter((id) => id !== characterId)
    );
  };

  // Email handling functions
  const addParticipant = async () => {
    if (!Object.keys(participants).includes(participant)) {
      const users_details = await getUsersDetails([participant]);
      if (users_details.length === 0) {
        setErrorMessage(t("User not found"));
        return;
      } else if (users_details[0].is_self) {
        setErrorMessage(t("You cannot add yourself"));
        return;
      } else {
        setErrorMessage(null);
        setParticipants({ ...participants, [participant]: users_details[0] });
        setParticipant("");
      }
    }
  };

  const removeParticipant = (participant: string) => {
    const newParticipants = { ...participants };
    delete newParticipants[participant];
    setParticipants(newParticipants);
  };

  const toggleParticipantSelection = (participant: string) => {
    if (selectedParticipants.includes(participant)) {
      setSelectedParticipants(
        selectedParticipants.filter((p) => p !== participant)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsGroupCreating(true);

    // Reset error message first
    setErrorMessage(null);

    // Validation check for private chats
    if (
      !isPublic &&
      Object.keys(participants).length === 0 &&
      selectedCharacters.length === 0
    ) {
      setErrorMessage(
        t("Private chat groups must have at least one participant or character")
      );
      return;
    }

    try {
      const chatGroup = await createChatGroup({
        groupName,
        participants,
        characters: selectedCharacters,
        isPublic,
        participation,
        charactersParticipation,
        customParticipants:
          participation === "custom" ? selectedParticipants : [],
      });
      dispatch(setChatGroup(objectSnakeToCamel(chatGroup.chat_group)));
      dispatch(setThread(chatGroup.thread));
      setIsGroupCreating(false);
      navigate(`/social/chat/${chatGroup.thread.threadId}`);
    } catch (e: any) {
      setIsGroupCreating(false);
      setErrorMessage(e.message);
    }
  };
  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-darkMainSurfaceSecondary rounded-lg shadow">
      <div className="text-xl font-semibold mb-6">
        {t("Create a New Chat Group")}
      </div>
      <form onSubmit={handleSubmit}>
        {/* Public/Private Toggle */}
        <div className="mb-6">
          <span className="block text-sm font-medium mb-1">
            {t("Visibility")}
          </span>
          <div className="flex space-x-4">
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
          </div>
        </div>

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

        {/* Characters */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            {t("Add Characters")}
            <span className="text-xs text-gray-500 ml-2">
              ({selectedCharacters.length}/{MAX_CHARACTERS} {t("selected")})
            </span>
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
                {filteredCharacters.map((character: any) => (
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
                          {character.name?.charAt(0)}
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
              className="px-4 py-2 bg-textOptionSelected dark:bg-darkTextOptionSelected text-white rounded-r-md hover:bg-backgroundOptionSelected dark:hover:bg-darkBackgroundOptionSelected  hover:border-textOptionSelected dark:hover:border-darkTextOptionSelected border border-textOptionSelected dark:border-darkTextOptionSelected dark:border-darkTextOptionSelected"
            >
              {t("Add")}
            </button>
          </div>

          {/* Email list */}
          {Object.keys(participants).length > 0 && (
            <div className="mt-2 space-y-1">
              {Object.keys(participants).map((p, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded"
                >
                  <div className="flex flex-row">
                    <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-lightGray dark:bg-darkMainSurfaceSecondary mr-2">
                      {participants[p].profile_picture ? (
                        <img
                          src={participants[p].profile_picture.small}
                          alt={p}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-textSecondary">
                          {p.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm">{p}</span>
                  </div>
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
                checked={participation === "custom"}
                onChange={() => setParticipation("custom")}
                className="form-radio text-brandMainColor"
                name="custom"
              />
              <span className="ml-2">{t("Custom")}</span>
            </label>
          </div>
        </div>

        {/* Custom Participant Selection */}
        {participation === "custom" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {t("Select participants who can send messages")}
            </label>
            <div className="mt-2 border border-borderColor dark:border-darkBorderColor rounded-md p-2 max-h-48 overflow-y-auto">
              {participants.length === 0 ? (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                  {t("No participants added yet")}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.keys(participants).map((participant, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "flex items-center p-2 border rounded-md cursor-pointer",
                        selectedParticipants.includes(
                          participants[participant].user_id
                        )
                          ? "border-brandMainColor bg-blue-50 dark:bg-blue-900"
                          : "border-borderColor dark:border-darkBorderColor"
                      )}
                      onClick={() =>
                        toggleParticipantSelection(
                          participants[participant].user_id
                        )
                      }
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-darkMainSurfacePrimary rounded-full mr-2 flex items-center justify-center">
                        {participants[participant].profile_picture ? (
                          <img
                            src={
                              participants[participant].profile_picture.medium
                            }
                            alt={participant}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-textSecondary">
                            {participant.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm truncate">{participant}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Display error message if there's any */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={isGroupCreating}
            onClick={() => navigate("/social/chat")}
            className="mr-2 px-4 py-2 border rounded-md hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={isGroupCreating}
            className="px-4 py-2 bg-textOptionSelected dark:bg-darkTextOptionSelected text-white rounded-md hover:bg-backgroundOptionSelected dark:hover:bg-darkBackgroundOptionSelected hover:border-textOptionSelected dark:hover:border-darkTextOptionSelected border border-textOptionSelected dark:border-darkTextOptionSelected dark:border-darkTextOptionSelected"
          >
            {isGroupCreating ? (
              <div className="w-[24px] h-[24px]">
                <LoadingIcon />
              </div>
            ) : (
              t("Create")
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChatGroup;
