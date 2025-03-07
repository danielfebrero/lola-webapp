import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import SearchInput from "../../components/SearchInput";
import CategoryTabs from "../../components/CategoryTabs";
import ChatGroupCard from "../../components/ChatGroupCard";
import { chatGroupService } from "../../serices/chatGroupService";
import { ChatGroup, SortOption } from "../../types/chatGroup";
import { useDebounce } from "../../hooks/useDebounce";

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "active", label: "Active" },
  { id: "trending", label: "Trending" },
  { id: "members", label: "Popular" },
];

const ExploreChatGroups: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const groups = await chatGroupService.getPublicChatGroups(
          debouncedSearch,
          sortBy
        );
        setChatGroups(groups);
      } catch (error) {
        console.error("Failed to fetch chat groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [debouncedSearch, sortBy]);

  const handleCreateNewGroup = () => {
    navigate("/social/chat/new");
  };

  return (
    <div className="w-full max-w-3xl p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-textPrimary dark:text-darkTextPrimary mb-2">
          {t("Explore Chat Groups")}
        </h1>
        <p className="text-textSecondary dark:text-darkTextSecondary">
          {t("Discover public conversations and join the discussion")}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("Search for groups...")}
            className="sm:w-64"
          />
          <CategoryTabs
            tabs={sortOptions}
            activeTab={sortBy}
            onTabChange={(id) => setSortBy(id as SortOption)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-darkPrimary"></div>
          </div>
        ) : chatGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {chatGroups.map((group) => (
              <ChatGroupCard key={group.threadId} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-textSecondary dark:text-darkTextSecondary mb-4">
              {debouncedSearch
                ? t("No chat groups found matching your search")
                : t("No chat groups available")}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-2">
          <button
            onClick={handleCreateNewGroup}
            className="bg-primary hover:bg-primary/90 text-white dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 dark:text-darkTextPrimary px-4 py-2 rounded-md font-medium flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t("Create New Group")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreChatGroups;
