import { useLocation } from "react-router";
import clsx from "clsx";
import React from "react";
import { useState } from "react";
import Loading from "../Loading";
import Message from "../Message";
import { Message as MessageType } from "../../types/chat";
import ImageSlider from "../ImageSlider";
import LoadingIcon from "../../icons/loading";
import { useAppSelector } from "../../store/hooks";

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
  const user = useAppSelector((state) => state.user);
  const { characters, users } = useAppSelector((state) => state.app);

  // Function to get profile picture based on message type
  const getProfilePicture = (message: MessageType) => {
    if (message.role === "user" && message.user_id === user?.settings.user_id) {
      // Return user profile picture
      return user?.settings.profile_picture?.medium || null;
    } else if (
      message.role === "user" &&
      message.user_id !== user?.settings.user_id
    ) {
      // Return user profile picture
      return (
        users.find((u) => u.user_id === message.user_id)?.profile_picture
          ?.medium || null
      );
    } else if (message.role === "character") {
      // Return character avatar
      return (
        characters.find((c) => c.thread_id === message.threadId)?.avatar
          ?.large ||
        characters.find((c) => c.thread_id === message.threadId)
          ?.imagesMultisize?.[0]?.large ||
        null
      );
    }
    // Assistant default
    return null;
  };

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
                  isCurrentUser={
                    message.role === "user" &&
                    message.user_id === user?.settings.user_id
                  }
                  profilePicture={getProfilePicture(message)}
                />
                {message.role !== "user" &&
                  message.image_gen_on &&
                  (message.expected_image_count === 1 ||
                    message.expected_image_count === 2) && (
                    <div
                      className={clsx(
                        {
                          "grid grid-cols-2 gap-4":
                            message.expected_image_count === 2,
                          "flex flex-grow justify-center":
                            message.expected_image_count === 1,
                        },
                        "mb-[20px]"
                      )}
                    >
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
                          "h-[330px] w-[330px] cursor-pointer aspect-square flex justify-center items-center bg-black rounded-lg bg-lightGray dark:bg-darkMessageBackground"
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
                      {message.expected_image_count === 2 && (
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
                      )}
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
