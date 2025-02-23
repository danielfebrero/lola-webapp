import { Message as MessageType } from "../../types/chat";
import Loading from "../Loading";
import Message from "../Message"; // Import the new component

interface ChatLayoutProps {
  chatLog?: MessageType[];
  isLoading?: boolean;
}

const ChatLayout: React.FC<ChatLayoutProps> = (props) => {
  return (
    <div className="w-full max-w-[715px]">
      <div className="w-full flex">
        <div className="w-auto grow mb-[30px] md:px-[20px]">
          {props.isLoading ? <Loading /> : null}
          {!props.isLoading &&
            props.chatLog?.map((message, idx) => (
              <Message
                key={message.id ?? message.timestamp ?? idx}
                message={message}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
