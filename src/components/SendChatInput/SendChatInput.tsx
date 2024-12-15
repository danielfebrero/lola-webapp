import { useState } from "react";

interface SendChatInputProps {
  type: "character" | "story" | "game";
  id?: string;
}

const SendChatInput: React.FC<SendChatInputProps> = (props) => {
  const [value, setValue] = useState<string>("");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`; // Set new height
    setValue(textarea.value);
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <div className="w-full flex items-center bg-lightGray rounded-lg p-[10px]">
        <textarea
          value={value}
          onChange={handleInput}
          className="bg-transparent border-none placeholder:text-textSecondary outline-none w-full overflow-hidden resize-none"
          placeholder="Type a message..."
          rows={1}
        ></textarea>
      </div>
    </div>
  );
};

export default SendChatInput;
