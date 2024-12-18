import { useState } from "react";

interface SendChatInputProps {
  type: "character" | "story" | "game" | "lola";
  id?: string;
  onSend?: (message: string) => void;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`;
    setValue(textarea.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (props.onSend && value.trim() !== "") {
        props.onSend(value.trim());
        setValue("");
      }
    }
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex items-center bg-lightGray rounded-lg p-[10px]">
        <textarea
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none placeholder:text-textSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message and press Enter to send..."
          rows={1}
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInput;
