import React from "react";
import clsx from "clsx";
import MarkdownToHTML from "../MarkdownToHTML";
import { Message as MessageType } from "../../types/chat";

interface MessageProps {
  message: MessageType; // Message data including role and content
  isLast?: boolean; // Indicates if this is the last message in the chat
  isAssistantWriting?: boolean; // Shows a writing indicator for assistant messages
  maxWidth?: string; // Custom max-width for message bubble
  className?: string; // Additional custom classes
  isCurrentUser?: boolean; // Whether this message is from the current user
  profilePicture?: string | null; // URL to the profile picture
}

const Message: React.FC<MessageProps> = ({
  message,
  isLast = false,
  isAssistantWriting = false,
  maxWidth,
  className,
  isCurrentUser = false,
  profilePicture,
}) => {
  const getMessageColor = () => {
    if (message.role === "user") {
      return isCurrentUser
        ? "bg-messageBackground dark:bg-darkMessageBackground"
        : "bg-gray-100 dark:bg-gray-700";
    } else if (message.role === "assistant") {
      return "";
    } else if (message.role === "character") {
      return "bg-purple-50 dark:bg-purple-900/30";
    }
    return "bg-gray-50 dark:bg-gray-800";
  };

  return (
    <div
      className={clsx(
        "mb-[20px] flex items-start gap-2", // Gap between avatar and message
        {
          "flex-row-reverse": isCurrentUser, // Right-align current user messages
          "flex-row": !isCurrentUser, // Left-align all other messages
        },
        className
      )}
    >
      {/* Profile picture */}
      {message.role !== "assistant" && (
        <div
          className={clsx(
            {
              "bg-brandMainColor": isCurrentUser,
              "bg-brandMainColorDarker":
                !isCurrentUser && message.role === "user",
            },
            "w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
          )}
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={`${message.role} avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={clsx(
                "w-full h-full flex items-center justify-center text-white text-xs"
              )}
            ></div>
          )}
        </div>
      )}

      {/* Message content */}
      <div
        className={clsx(
          "rounded-lg p-[10px]",
          getMessageColor(),
          maxWidth || "md:max-w-[80%]"
        )}
      >
        <MarkdownToHTML
          content={message.content}
          showWorkerIndicator={
            isLast && isAssistantWriting && message.role === "assistant"
          }
        />
      </div>
    </div>
  );
};

export default Message;
