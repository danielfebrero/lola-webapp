import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";
import { Link, useSearchParams, useParams } from "react-router";

import JSONToText from "../../components/JSONToText";
import Meta from "../../components/Meta";
import UpvoteIcon from "../../icons/upvote";
import DownvoteIcon from "../../icons/downvote";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  downvoteExplore,
  setMode,
  upvoteExplore,
} from "../../store/features/app/appSlice";
import useGA from "../../hooks/useGA";
import ImageViewer from "../../components/ImageViewer/ImageViewer";

const ExplorePage: React.FC = (props) => {
  const { sendEvent } = useGA();
  const { t } = useTranslation();
  const {
    getExploreBest,
    getExploreLatest,
    upvote,
    downvote,
    getClickedVotes,
    socketConnection,
  } = useWebSocket({});
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { explore, exploreLanguage, isLeftPanelOpen } = useAppSelector(
    (state) => state.app
  );
  const { clickedUpvotes, clickedDownvotes } = useAppSelector(
    (state) => state.user
  );
  const [stateClickedUpvotes, setStateClickedUpvotes] = useState<string[]>([]);
  const [stateClickedDownvotes, setStateClickedDownvotes] = useState<string[]>(
    []
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchParams.get("adult") === "1") dispatch(setMode("adult"));
  }, [searchParams]);

  useEffect(() => {
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      params.type === "best" ? getExploreBest() : getExploreLatest();
      getClickedVotes();
    }
  }, [socketConnection, params.type, exploreLanguage]);

  useEffect(() => {
    setStateClickedDownvotes(clickedDownvotes);
  }, [clickedDownvotes]);

  useEffect(() => {
    setStateClickedUpvotes(clickedUpvotes);
  }, [clickedUpvotes]);

  return (
    <>
      <Meta title={t(params.type === "best" ? "Best content" : "Latest")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            {(params.type === "best" ? explore.best : explore.latest).map(
              (c) => (
                <div
                  className={clsx(
                    "p-[10px] hover:bg-lightGray rounded-lg dark:hover:bg-darkMainSurfaceSecondary border-b border-borderColor dark:border-darkBorderColor w-full items-center flex flex-col"
                  )}
                >
                  <div
                    className={clsx(
                      { "max-w-[715px]": c.thread.type === "story" },
                      "flex flex-col h-auto overflow-y-hidden cursor-pointer w-full"
                    )}
                  >
                    {c.thread.type === "story" && (
                      <Link to={"/" + c.thread.type + "/" + c.thread.threadId}>
                        <div className="font-bold mb-[10px] text-lg self-middle">
                          {c.thread.title}
                        </div>
                      </Link>
                    )}

                    <div>
                      {c.thread.type === "story" &&
                        c.story?.image_search_results &&
                        c.story.image_search_results.length > 0 && (
                          <div className="flex flex-row overflow-y-scroll mb-[10px]">
                            <ImageViewer
                              images={c.story.image_search_results}
                            />
                          </div>
                        )}
                      <Link to={"/" + c.thread.type + "/" + c.thread.threadId}>
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
                          <>
                            <div className="flex flex-row">
                              <div
                                className={clsx(
                                  {
                                    "w-[calc(50vw-550px)]": isLeftPanelOpen,
                                    "w-[calc(50vw-420px)]": !isLeftPanelOpen,
                                  },
                                  "min-w-[120px] md:mr-0 mr-[20px] transition-all duration-500 justify-center flex"
                                )}
                              >
                                <div
                                  className={clsx(
                                    "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex flex-shrink-0"
                                  )}
                                >
                                  {c.character?.imagesMultisize &&
                                  c.character?.imagesMultisize.length > 0 ? (
                                    <img
                                      alt={c.character?.json?.name}
                                      className={clsx(
                                        "rounded-full object-cover"
                                      )}
                                      src={
                                        c.character?.imagesMultisize[0].large
                                      }
                                    />
                                  ) : null}
                                </div>
                              </div>
                              <div className="max-w-[715px] flex flex-row">
                                <div className="flex-shrink-0 mr-[20px] max-w-[300px]">
                                  <JSONToText data={c.character?.json ?? {}} />
                                </div>
                                <div className="hidden md:block max-w-[715px]">
                                  {c.thread.chatLog
                                    ?.slice(-2)
                                    .map((message, idx) =>
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
                                            <Markdown>
                                              {message.content}
                                            </Markdown>
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
                            </div>
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-row w-full justify-center">
                    <div className="flex flex-row w-full max-w-[715px]">
                      <div className="flex flex-row mt-[10px]">
                        <div className="flex flex-row rounded-lg dark:bg-darkMainSurcaceTertiary bg-gray-200 items-center">
                          <div
                            onClick={() => {
                              if (
                                !stateClickedUpvotes.includes(c.thread.threadId)
                              ) {
                                upvote(c.thread.threadId);
                                sendEvent("add_upvote", "explore");
                                dispatch(upvoteExplore(c.thread.threadId));
                                setStateClickedUpvotes((prev) => [
                                  ...prev,
                                  c.thread.threadId,
                                ]);
                                if (
                                  stateClickedDownvotes.includes(
                                    c.thread.threadId
                                  )
                                ) {
                                  dispatch(upvoteExplore(c.thread.threadId));
                                  setStateClickedDownvotes((prev) =>
                                    prev.filter((t) => t !== c.thread.threadId)
                                  );
                                }
                              }
                            }}
                            className={clsx(
                              {
                                "dark:bg-darkMainSurfacePrimary bg-white":
                                  stateClickedUpvotes.includes(
                                    c.thread.threadId
                                  ),
                              },
                              "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
                            )}
                          >
                            <UpvoteIcon />
                          </div>
                          <span className="mx-[5px]">
                            {c.thread.votes ?? 0}
                          </span>
                          <div
                            onClick={() => {
                              if (
                                !stateClickedDownvotes.includes(
                                  c.thread.threadId
                                )
                              ) {
                                downvote(c.thread.threadId);
                                sendEvent("add_downvote", "explore");
                                dispatch(downvoteExplore(c.thread.threadId));
                                setStateClickedDownvotes((prev) => [
                                  ...prev,
                                  c.thread.threadId,
                                ]);
                                if (
                                  stateClickedUpvotes.includes(
                                    c.thread.threadId
                                  )
                                ) {
                                  dispatch(downvoteExplore(c.thread.threadId));
                                  setStateClickedUpvotes((prev) =>
                                    prev.filter((t) => t !== c.thread.threadId)
                                  );
                                }
                              }
                            }}
                            className={clsx(
                              {
                                "dark:bg-darkMainSurfacePrimary bg-white":
                                  stateClickedDownvotes.includes(
                                    c.thread.threadId
                                  ),
                              },
                              "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
                            )}
                          >
                            <DownvoteIcon />
                          </div>
                        </div>
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
