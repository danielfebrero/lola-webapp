import React from "react";
import clsx from "clsx";

interface Tab {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            {
              "bg-primary text-white dark:bg-darkPrimary dark:text-darkTextPrimary":
                activeTab === tab.id,
              "bg-lightGray dark:bg-darkMainSurfaceSecondary text-textSecondary dark:text-darkTextSecondary hover:bg-gray-200 dark:hover:bg-gray-700":
                activeTab !== tab.id,
            }
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
