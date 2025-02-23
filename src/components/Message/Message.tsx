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
}

const Message: React.FC<MessageProps> = ({
  message,
  isLast = false,
  isAssistantWriting = false,
  maxWidth,
  className,
}) => {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "mb-[20px]", // Consistent margin between messages
        {
          "flex flex-row justify-end": isUser, // Right-align user messages
          "flex flex-col": !isUser, // Left-align assistant messages
        },
        className
      )}
    >
      <div
        className={clsx(
          "rounded-lg p-[10px]",
          {
            "bg-messageBackground dark:bg-darkMessageBackground": isUser,
            "max-w-[100%]": !isUser, // Full width for assistant by default
          },
          maxWidth && !isUser ? maxWidth : isUser && (maxWidth || "max-w-[80%]") // Apply custom max-width
        )}
      >
        <MarkdownToHTML
          content={message.content}
          showWorkerIndicator={isLast && isAssistantWriting && !isUser}
        />
      </div>
    </div>
  );
};

export default Message;
