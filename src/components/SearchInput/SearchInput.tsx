import React from "react";
import { useTranslation } from "react-i18next";
import SearchIcon from "../../icons/search";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 pl-10 text-sm rounded-lg border 
                 bg-lightGray dark:bg-darkMainSurfaceSecondary
                 text-textPrimary dark:text-darkTextPrimary
                 border-borderColor dark:border-darkBorderColor
                 focus:ring-primary focus:border-primary dark:focus:ring-darkPrimary dark:focus:border-darkPrimary"
        placeholder={placeholder || t("Search...")}
      />
    </div>
  );
};

export default SearchInput;
