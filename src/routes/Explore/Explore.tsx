import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Link, useParams, useNavigate } from "react-router";

import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";
import ImageViewer from "../../components/ImageViewer/ImageViewer";
import MarkdownToHTML from "../../components/MarkdownToHTML";
import useAPI from "../../hooks/useAPI";
import ChevronDownIcon from "../../icons/chevronDown";
import Vote from "../../components/Vote";

const titleByType = {
  best: "Best content",
  latest: "Latest",
};

const ExplorePage: React.FC = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getClickedVotes, socketConnection } = useWebSocket({});
  const { getExplore } = useAPI();
  const params = useParams();
  const { explore, exploreLanguage, isLeftPanelOpen, mode } = useAppSelector(
    (state) => state.app
  );
  const [expandedThread, setExpandedThread] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.exploreMode && params.type) {
      getExplore(params.exploreMode, params.type);
    }
  }, [params.exploreMode, params.type, exploreLanguage, mode]);

  useEffect(() => {
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      getClickedVotes();
    }
  }, [socketConnection?.readyState]);

  useEffect(() => {
    if (params.exploreMode === "latest" && !params.type)
      navigate("/explore/characters/latest");
  }, [params.exploreMode, params.type]);

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: null, objectId: null }));
  }, []);

  return (
    <>
      <Meta title={t(titleByType[params.exploreMode as "best"])} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center max-w-full">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            {explore.items
              ?.filter(
                (c) =>
                  c.thread.type === "story" ||
                  (c.character?.imagesMultisize &&
                    c.character.imagesMultisize?.length > 0)
              )
              .map((c) => (
                <div
                  className={clsx(
                    "h-auto p-[10px] hover:bg-lightGray rounded-lg dark:hover:bg-darkMainSurfaceSecondary border-b border-borderColor dark:border-darkBorderColor w-full items-center flex flex-col"
                  )}
                  key={c.thread.threadId}
                >
                  <div
                    className={clsx(
                      { "max-w-[715px]": c.thread.type === "story" },
                      {
                        "max-h-[600px]": !expandedThread.includes(
                          c.thread.threadId
                        ),
                        "max-h-full": expandedThread.includes(
                          c.thread.threadId
                        ),
                      },
                      "transition-all duration-500 flex flex-col h-auto overflow-y-hidden cursor-pointer w-full"
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
                          <div className="mb-[20px]">
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
                                  <MarkdownToHTML
                                    content={message.content}
                                    showWorkerIndicator={false}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="" key={message.id}>
                                <MarkdownToHTML
                                  content={message.content}
                                  showWorkerIndicator={false}
                                />
                              </div>
                            )
                          )}
                        {c.thread.type === "character" && (
                          <>
                            <div className="flex flex-row h-full">
                              <div
                                className={clsx(
                                  {
                                    "md:w-[calc(50vw-550px)] w-[calc(50vw-590px)]":
                                      isLeftPanelOpen,
                                    "md:w-[calc(50vw-420px)] w-[calc(50vw-460px)]":
                                      !isLeftPanelOpen,
                                  },
                                  "md:min-w-[120px] min-w-[80px] md:mr-0 mr-[20px] transition-all duration-500 justify-center flex"
                                )}
                              >
                                <div
                                  className={clsx(
                                    "md:h-[120px] md:w-[120px] h-[80px] w-[80px] items-center flex flex-shrink-0 ml-[15px]"
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
                                        c.character?.avatar?.large ??
                                        c.character?.imagesMultisize[0].large
                                      }
                                    />
                                  ) : null}
                                </div>
                              </div>
                              <div className="max-w-[715px] flex flex-row md:ml-[30px]">
                                <div className="flex-shrink-0 mr-[20px] md:max-w-[300px] max-w-full">
                                  <span className="italic">
                                    {c.character?.summary &&
                                    c.character?.summary.length > 0
                                      ? c.character?.summary
                                      : t("No description yet.")}
                                  </span>
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
                                            <MarkdownToHTML
                                              content={message.content}
                                              showWorkerIndicator={false}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className="mb-[10px]"
                                          key={message.id}
                                        >
                                          <MarkdownToHTML
                                            content={message.content}
                                            showWorkerIndicator={false}
                                          />
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
                      <div className="flex flex-row mt-[10px] grow">
                        <Vote thread={c.thread} pageContext="explore" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <div
                      className=""
                      onClick={() =>
                        setExpandedThread((prev) =>
                          prev.includes(c.thread.threadId)
                            ? prev.filter((s) => s !== c.thread.threadId)
                            : [...prev, c.thread.threadId]
                        )
                      }
                    >
                      <div
                        className={clsx(
                          {
                            "transform rotate-180": expandedThread.includes(
                              c.thread.threadId
                            ),
                          },
                          "w-[44px] h-[44px] cursor-pointer p-[10px]"
                        )}
                      >
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
