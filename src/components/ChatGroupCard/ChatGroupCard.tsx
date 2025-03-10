import React from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import { ChatGroup } from "../../types/chatGroup";
import { useAppSelector } from "../../store/hooks";

interface ChatGroupCardProps {
  group: ChatGroup;
}

const ChatGroupCard: React.FC<ChatGroupCardProps> = ({ group }) => {
  const navigate = useNavigate();
  const threads = useAppSelector((state) => state.app.chatLogs);

  const handleClick = () => {
    navigate(`/social/chat/${group.threadId}`);
  };

  const thread = threads.find((t) => t.threadId === group.threadId);
  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-mainSurface dark:bg-darkMainSurfaceSecondary 
                 border border-borderColor dark:border-darkBorderColor rounded-lg 
                 shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
    >
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white dark:bg-darkMainSurfacePrimary">
          {group.imagesMultisize?.large ? (
            <img
              src={group.imagesMultisize?.large}
              alt={group.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-brandMainColorDarker dark:bg-darkBrandMainColorDarker flex items-center justify-center text-white font-bold">
              {thread?.title?.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-textPrimary dark:text-darkTextPrimary truncate">
            {thread?.title}
          </h3>
          <p className="text-sm text-textSecondary dark:text-darkTextSecondary line-clamp-2">
            {group.description ?? "No description"}
          </p>
        </div>
      </div>

      <div className="flex items-center mt-3 text-xs text-textSecondary dark:text-darkTextSecondary space-x-3">
        <div>{group.membersCount?.toLocaleString()} members</div>
        <div>
          {" "}
          {group.lastMessageDate
            ? `Last active ${moment(group.lastMessageDate).fromNow()}`
            : "No messages yet"}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {(!group.tags || group.tags.length === 0) && (
          <span className="text-xs text-textSecondary dark:text-darkTextSecondary">
            No tags
          </span>
        )}
        {group.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-white dark:bg-darkMainSurfacePrimary rounded-full px-2 py-0.5 text-textSecondary dark:text-darkTextSecondary"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChatGroupCard;
