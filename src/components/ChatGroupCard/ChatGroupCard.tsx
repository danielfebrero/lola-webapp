import React from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import { ChatGroup } from "../../types/chatGroup";

interface ChatGroupCardProps {
  group: ChatGroup;
}

const ChatGroupCard: React.FC<ChatGroupCardProps> = ({ group }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/social/chat/${group.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-mainSurface dark:bg-darkMainSurfaceSecondary 
                 border border-borderColor dark:border-darkBorderColor rounded-lg 
                 shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
    >
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white dark:bg-darkMainSurfacePrimary">
          {group.imageUrl ? (
            <img
              src={group.imageUrl}
              alt={group.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary dark:bg-darkPrimary flex items-center justify-center text-white font-bold">
              {group.title.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-textPrimary dark:text-darkTextPrimary truncate">
            {group.title}
          </h3>
          <p className="text-sm text-textSecondary dark:text-darkTextSecondary line-clamp-2">
            {group.description}
          </p>
        </div>
      </div>

      <div className="flex items-center mt-3 text-xs text-textSecondary dark:text-darkTextSecondary space-x-3">
        <div>{group.memberCount.toLocaleString()} members</div>
        <div>Last active {moment(group.lastMessageDate).fromNow()}</div>
      </div>

      {group.tags && group.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {group.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-white dark:bg-darkMainSurfacePrimary rounded-full px-2 py-0.5 text-textSecondary dark:text-darkTextSecondary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatGroupCard;
