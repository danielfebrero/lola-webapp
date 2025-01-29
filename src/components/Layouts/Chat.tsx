import Loading from "../Loading";
import MarkdownToHTML from "../MarkdownToHTML";

interface ChatLayoutProps {
  chatLog?: Message[];
  isLoading?: boolean;
}

const ChatLayout: React.FC<ChatLayoutProps> = (props) => {
  return (
    <div className="w-full max-w-[715px]">
      <div className="w-full flex">
        <div className="w-auto grow mb-[30px]">
          {props.isLoading ? <Loading /> : null}
          {!props.isLoading &&
            props.chatLog?.map((message, idx) =>
              message.role === "user" ? (
                <div
                  className="flex flex-row justify-end mb-[20px]"
                  key={message.id ?? message.timestamp ?? idx}
                >
                  <div className="w-fit bg-messageBackground dark:bg-darkMessageBackground rounded-lg p-[10px]">
                    <MarkdownToHTML
                      content={message.content}
                      showWorkerIndicator={false}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-row mb-[10px]"
                  key={message.timestamp ?? idx}
                >
                  <div className="grow max-w-[100%] md:px-[30px]">
                    <MarkdownToHTML
                      content={message.content}
                      showWorkerIndicator={false}
                    />
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
