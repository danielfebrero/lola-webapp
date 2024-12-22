import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Markdown from "markdown-to-jsx";

import imageLola from "../../lola.jpeg";
import imageDani from "../../dani.webp";
import clsx from "clsx";

interface ChatProps {
  type: "character" | "story" | "game" | "lola";
  id?: string;
  chatLog?: Message[];
}

const Chat: React.FC<ChatProps> = (props) => {
  const location = useLocation();

  return (
    <div className="w-full max-w-[715px]">
      <div className="w-full flex">
        <div className="w-auto grow mb-[30px]">
          {props.chatLog?.map((message, idx) =>
            message.role === "user" ? (
              <div
                className="flex flex-row justify-end mb-[20px]"
                key={message.id ?? message.timestamp ?? idx}
              >
                <div
                  className={clsx(
                    {
                      "max-w-[60%]": location.pathname.indexOf("/story") === 0,
                      "max-w-[80%]": location.pathname.indexOf("/story") !== 0,
                    },
                    "w-fit  bg-messageBackground rounded-lg p-[10px]"
                  )}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-row mb-[10px]"
                key={message.timestamp ?? idx}
              >
                <div className="w-[30px] h-[30px] mr-[10px]">
                  {message.role !== "assistant" ? (
                    <img
                      className="rounded-full h-[30px] w-[30px] object-cover"
                      src={message.role === "cara" ? imageLola : imageDani}
                    />
                  ) : null}
                </div>
                <div className="grow max-w-[calc(100%-50px)]">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
