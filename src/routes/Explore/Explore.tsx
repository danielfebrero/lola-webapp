import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";
import { Link } from "react-router";

import JSONToText from "../../components/JSONToText";
import Meta from "../../components/Meta";
import UpvoteIcon from "../../icons/upvote";
import DownvoteIcon from "../../icons/downvote";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  downvoteExplore,
  upvoteExplore,
} from "../../store/features/app/appSlice";

interface ExplorePageProps {
  type: string;
}

const ExplorePage: React.FC<ExplorePageProps> = (props) => {
  const { t } = useTranslation();
  const { getExploreBest, getExploreLatest } = useWebSocket({});
  const { explore, socketConnection } = useAppSelector((state) => state.app);
  const [clickedUpvotes, setClickedUpvotes] = useState<string[]>([]);
  const [clickedDownvotes, setClickedDownvotes] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      props.type === "best" ? getExploreBest() : getExploreLatest();
    }
  }, [socketConnection]);

  return (
    <>
      <Meta title={t(props.type === "best" ? "Best content" : "Latest")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col  max-w-[715px] w-screen">
            {(props.type === "best" ? explore.best : explore.latest).map(
              (c) => (
                <div className="p-[10px] hover:bg-lightGray rounded-lg dark:hover:bg-darkMainSurfaceSecondary border-b border-borderColor dark:border-darkBorderColor">
                  <div className="flex flex-col h-auto overflow-y-hidden cursor-pointer">
                    <Link to={"/" + c.thread.type + "/" + c.thread.threadId}>
                      <div className="font-bold mb-[10px] text-lg">
                        {c.thread.title}
                      </div>
                      {c.thread.type === "story" &&
                        c.thread.chatLog?.slice(0, 2).map((message) =>
                          message.role === "user" ? (
                            <div
                              className="flex flex-row justify-end mb-[10px]"
                              key={message.id}
                            >
                              <div
                                className={clsx(
                                  "bg-messageBackground dark:bg-darkMessageBackground rounded-lg p-[10px]"
                                )}
                              >
                                <Markdown>{message.content}</Markdown>
                              </div>
                            </div>
                          ) : (
                            <div className="" key={message.id}>
                              <Markdown>{message.content}</Markdown>
                            </div>
                          )
                        )}
                      {c.thread.type === "character" && (
                        <div className="flex flex-row">
                          <div
                            className={clsx(
                              "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex flex-shrink-0"
                            )}
                          >
                            {c.character?.imagesMultisize &&
                            c.character?.imagesMultisize.length > 0 ? (
                              <img
                                alt={c.character?.json?.name}
                                className={clsx("rounded-full object-cover")}
                                src={c.character?.imagesMultisize[0].large}
                              />
                            ) : null}
                          </div>
                          <div className="flex-shrink-0 mr-[20px] md:max-w-[200px]">
                            <JSONToText data={c.character?.json ?? {}} />
                          </div>
                          <div className="hidden md:block">
                            {c.thread.chatLog?.slice(-2).map((message, idx) =>
                              message.role === "user" ? (
                                <div
                                  className="flex flex-row justify-end mb-[10px]"
                                  key={message.id}
                                >
                                  <div
                                    className={clsx(
                                      "bg-messageBackground dark:bg-darkMessageBackground rounded-lg p-[10px]"
                                    )}
                                  >
                                    <Markdown>{message.content}</Markdown>
                                  </div>
                                </div>
                              ) : (
                                <div className="" key={message.id}>
                                  <Markdown>{message.content}</Markdown>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="flex flex-row mt-[10px]">
                    <div className="flex flex-row rounded-lg dark:bg-darkMainSurcaceTertiary bg-gray-200 items-center">
                      <div
                        onClick={() => {
                          if (!clickedUpvotes.includes(c.thread.threadId)) {
                            dispatch(upvoteExplore(c.thread.threadId));
                            setClickedUpvotes((prev) => [
                              ...prev,
                              c.thread.threadId,
                            ]);
                            if (clickedDownvotes.includes(c.thread.threadId)) {
                              dispatch(upvoteExplore(c.thread.threadId));
                              setClickedDownvotes((prev) =>
                                prev.filter((t) => t !== c.thread.threadId)
                              );
                            }
                          }
                        }}
                        className={clsx(
                          {
                            "dark:bg-darkMainSurfacePrimary bg-white":
                              clickedUpvotes.includes(c.thread.threadId),
                          },
                          "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
                        )}
                      >
                        <UpvoteIcon />
                      </div>
                      <span className="mx-[5px]">
                        {(c.thread.upvotes ?? 0) - (c.thread.downvotes ?? 0)}
                      </span>
                      <div
                        onClick={() => {
                          if (!clickedDownvotes.includes(c.thread.threadId)) {
                            dispatch(downvoteExplore(c.thread.threadId));
                            setClickedDownvotes((prev) => [
                              ...prev,
                              c.thread.threadId,
                            ]);
                            if (clickedUpvotes.includes(c.thread.threadId)) {
                              dispatch(downvoteExplore(c.thread.threadId));
                              setClickedUpvotes((prev) =>
                                prev.filter((t) => t !== c.thread.threadId)
                              );
                            }
                          }
                        }}
                        className={clsx(
                          {
                            "dark:bg-darkMainSurfacePrimary bg-white":
                              clickedDownvotes.includes(c.thread.threadId),
                          },
                          "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
                        )}
                      >
                        <DownvoteIcon />
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
