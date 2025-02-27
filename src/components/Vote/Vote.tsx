import clsx from "clsx";
import { useEffect, useState } from "react";

import DownvoteIcon from "../../icons/downvote";
import UpvoteIcon from "../../icons/upvote";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import useWebSocket from "../../hooks/useWebSocket";
import useGA from "../../hooks/useGA";
import {
  downvoteExplore,
  upvoteExplore,
} from "../../store/features/app/appSlice";
import { ChatLog } from "../../types/chat";

interface VoteProps {
  thread: ChatLog;
}

const Vote: React.FC<VoteProps> = (props) => {
  const { upvote, downvote } = useWebSocket({});
  const { sendEvent } = useGA();
  const dispatch = useAppDispatch();
  const { clickedUpvotes, clickedDownvotes } = useAppSelector(
    (state) => state.user
  );
  const [isUpvoted, setIsUpvoted] = useState(
    clickedUpvotes.includes(props.thread.threadId)
  );
  const [isDownvoted, setIsDownvoted] = useState(
    clickedDownvotes.includes(props.thread.threadId)
  );

  useEffect(() => {
    setIsDownvoted(clickedDownvotes.includes(props.thread.threadId));
  }, [clickedDownvotes]);

  useEffect(() => {
    setIsUpvoted(clickedUpvotes.includes(props.thread.threadId));
  }, [clickedUpvotes]);

  return (
    <div className="flex flex-row rounded-full dark:bg-darkMainSurcaceTertiary bg-gray-200 items-center">
      <div
        onClick={() => {
          if (!isUpvoted) {
            upvote(props.thread.threadId);
            sendEvent("upvote", "explore");
            dispatch(upvoteExplore(props.thread.threadId));
            setIsUpvoted(true);
            if (isDownvoted) {
              // upvote a second time because it was downvoted before
              dispatch(upvoteExplore(props.thread.threadId));
              setIsDownvoted(false);
            }
          }
        }}
        className={clsx(
          {
            "dark:bg-darkMainSurfacePrimary bg-white": isUpvoted,
          },
          "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
        )}
      >
        <UpvoteIcon />
      </div>
      <span className="mx-[5px]">{props.thread.votes ?? 0}</span>
      <div
        onClick={() => {
          if (!isDownvoted) {
            downvote(props.thread.threadId);
            sendEvent("downvote", "explore");
            dispatch(downvoteExplore(props.thread.threadId));
            setIsDownvoted(true);
            if (isUpvoted) {
              // downvote a second time because it was upvoted before
              dispatch(downvoteExplore(props.thread.threadId));
              setIsUpvoted(false);
            }
          }
        }}
        className={clsx(
          {
            "dark:bg-darkMainSurfacePrimary bg-white": isDownvoted,
          },
          "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
        )}
      >
        <DownvoteIcon />
      </div>
    </div>
  );
};

export default Vote;
