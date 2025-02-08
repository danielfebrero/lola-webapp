import { useLocation } from "react-router";
import clsx from "clsx";

import Loading from "../Loading";
import MarkdownToHTML from "../MarkdownToHTML";
import LoadingIcon from "../../icons/loading";
import { Message } from "../../types/chat";

interface ChatProps {
  type?: "character" | "story" | "game" | "lola";
  id?: string | null;
  chatLog?: Message[];
  isChatLoading: boolean;
  isAssistantWriting: boolean;
}

const Chat: React.FC<ChatProps> = (props) => {
  const location = useLocation();

  return (
    <div className="w-full max-w-[715px]">
      {props.isChatLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex">
          <div className="w-auto grow mb-[30px] md:px-[20px]">
            {props.chatLog?.map((message, idx) =>
              message.role === "user" ? (
                <div
                  className="flex flex-row justify-end mb-[20px]"
                  key={message.id ?? message.timestamp ?? idx}
                >
                  <div
                    className={clsx(
                      {
                        "max-w-[60%]":
                          location.pathname.indexOf("/story") === 0,
                        "max-w-[80%]":
                          location.pathname.indexOf("/story") !== 0,
                      },
                      "w-fit  bg-messageBackground dark:bg-darkMessageBackground rounded-lg p-[10px]"
                    )}
                  >
                    <MarkdownToHTML
                      content={message.content}
                      showWorkerIndicator={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col" key={message.timestamp ?? idx}>
                  <div className="flex flex-row mb-[20px]">
                    <div className="grow max-w-[100%]">
                      <MarkdownToHTML
                        content={message.content}
                        showWorkerIndicator={
                          props.chatLog?.length &&
                          idx === props.chatLog?.length - 1
                            ? props.isAssistantWriting
                            : false
                        }
                      />
                    </div>
                  </div>
                  {message.image_gen_on &&
                    message.expected_image_count === 2 && (
                      <div className="grid grid-cols-2 gap-4 mb-[20px]">
                        <div
                          className={clsx(
                            "aspect-square flex justify-center items-center bg-black rounded-lg bg-lightGray dark:bg-darkMessageBackground"
                          )}
                        >
                          {message.images?.[0] ? (
                            <img
                              src={message.images?.[0].original}
                              alt="Generated on fabularius.ai"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-[72px] h-[72px]">
                              <LoadingIcon />
                            </div>
                          )}
                        </div>
                        <div className="aspect-square flex justify-center items-center bg-black rounded-lg bg-lightGray dark:bg-darkMessageBackground">
                          {message.images?.[0] ? (
                            <img
                              src={message.images?.[1].original}
                              alt="Generated on fabularius.ai"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-[72px] h-[72px]">
                              <LoadingIcon />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )
            )}
            {props.isAssistantWriting &&
              props.chatLog?.[props.chatLog?.length - 1]?.role === "user" && (
                <div className="flex w-full justify-center">
                  <div className="flex w-full max-w-[715px] px-[40px] pb-[40px] pt-[10px]">
                    <div className="rounded-full w-[12px] h-[12px] bg-textPrimary dark:bg-darkTextPrimary"></div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
