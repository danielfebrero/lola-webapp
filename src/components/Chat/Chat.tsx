import { useLocation } from "react-router";
import clsx from "clsx";
import React from "react";
import { useState } from "react";
import Loading from "../Loading";
import Message from "../Message";
import { Message as MessageType } from "../../types/chat";
import ImageSlider from "../ImageSlider";
import LoadingIcon from "../../icons/loading";

interface ChatProps {
  type?: "character" | "story" | "game" | "lola";
  id?: string | null;
  chatLog?: MessageType[];
  isChatLoading: boolean;
  isAssistantWriting: boolean;
}

const Chat: React.FC<ChatProps> = (props) => {
  const location = useLocation();
  const [imageViewingUrl, setImageViewingUrl] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[715px]">
      {props.isChatLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex">
          <div className="w-auto grow mb-[30px] md:px-[20px]">
            {props.chatLog?.map((message, idx) => (
              <React.Fragment key={message.id ?? message.timestamp ?? idx}>
                <Message
                  message={message}
                  isLast={idx === (props.chatLog?.length ?? 0) - 1}
                  isAssistantWriting={props.isAssistantWriting}
                  maxWidth={
                    message.role === "user" &&
                    location.pathname.indexOf("/story") === 0
                      ? "max-w-[60%]"
                      : undefined
                  }
                />
                {message.role !== "user" &&
                  message.image_gen_on &&
                  message.expected_image_count === 2 && (
                    <div className="grid grid-cols-2 gap-4 mb-[20px]">
                      {/* Image handling logic remains unchanged */}
                      {message.images && (
                        <ImageSlider
                          images={message.images}
                          imageViewingUrl={imageViewingUrl}
                          hide={() => setImageViewingUrl(null)}
                        />
                      )}
                      <div
                        className={clsx(
                          "cursor-pointer aspect-square flex justify-center items-center bg-black rounded-lg bg-lightGray dark:bg-darkMessageBackground"
                        )}
                        onClick={
                          message.images?.[0]
                            ? () =>
                                setImageViewingUrl(
                                  message.images?.[0].original ?? ""
                                )
                            : undefined
                        }
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
                      <div
                        onClick={
                          message.images?.[1]
                            ? () =>
                                setImageViewingUrl(
                                  message.images?.[1].original ?? ""
                                )
                            : undefined
                        }
                        className="cursor-pointer aspect-square flex justify-center items-center bg-black rounded-lg bg-lightGray dark:bg-darkMessageBackground"
                      >
                        {message.images?.[1] ? (
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
              </React.Fragment>
            ))}
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
