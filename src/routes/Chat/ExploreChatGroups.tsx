import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SearchInput from "../../components/SearchInput";
import CategoryTabs from "../../components/CategoryTabs";
import ChatGroupCard from "../../components/ChatGroupCard";
import { ChatGroup, SortOption } from "../../types/chatGroup";
import { useDebounce } from "../../hooks/useDebounce";
import Loading from "../../components/Loading";
import useAPI from "../../hooks/useAPI";

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "active", label: "Active" },
  { id: "trending", label: "Trending" },
  { id: "members", label: "Popular" },
];

const ExploreChatGroups: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getChatGroups } = useAPI();

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const groupsEntity = await getChatGroups(
          "explore",
          debouncedSearch,
          sortBy
        );
        setChatGroups(groupsEntity.chat_groups);
      } catch (error) {
        console.error("Failed to fetch chat groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [debouncedSearch, sortBy]);

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
          <Loading />
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
      </div>
    </div>
  );
};

export default ExploreChatGroups;
