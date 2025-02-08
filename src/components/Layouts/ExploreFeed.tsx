import clsx from "clsx";
import { Character } from "../../types/characters";
import ImageViewer from "../ImageViewer/ImageViewer";
import MarkdownToHTML from "../MarkdownToHTML";
import JSONToText from "../JSONToText";
import UpvoteIcon from "../../icons/upvote";
import DownvoteIcon from "../../icons/downvote";
import { Story } from "../../types/stories";
import { ChatLog } from "../../types/chat";

interface ExploreFeedLayoutProps {
  data: {
    thread: ChatLog;
    character: Character;
    story: Story;
  }[];
}

const ExploreFeedLayout: React.FC<ExploreFeedLayoutProps> = ({ data }) => {
  return (
    <>
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center max-w-full">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            {data.map((c) => (
              <div
                className={clsx(
                  "p-[10px] hover:bg-lightGray rounded-lg dark:hover:bg-darkMainSurfaceSecondary border-b border-borderColor dark:border-darkBorderColor w-full items-center flex flex-col"
                )}
                key={c.thread.threadId}
              >
                <div
                  className={clsx(
                    { "max-w-[715px]": c.thread.type === "story" },
                    "flex flex-col h-auto overflow-y-hidden cursor-pointer w-full"
                  )}
                >
                  {c.thread.type === "story" && (
                    <a href={"/" + c.thread.type + "/" + c.thread.threadId}>
                      <div className="font-bold mb-[10px] text-lg self-middle">
                        {c.thread.title}
                      </div>
                    </a>
                  )}

                  <div>
                    {c.thread.type === "story" &&
                      c.story?.image_search_results &&
                      c.story.image_search_results.length > 0 && (
                        <div className="mb-[20px]">
                          <ImageViewer images={c.story.image_search_results} />
                        </div>
                      )}
                    <a href={"/" + c.thread.type + "/" + c.thread.threadId}>
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
                          <div className="flex flex-row">
                            <div
                              className={clsx(
                                "md:flex hidden w-[calc(50vw-550px)] min-w-[120px] md:mr-0 mr-[20px] transition-all duration-500 justify-center flex"
                              )}
                            >
                              <div
                                className={clsx(
                                  "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex flex-shrink-0 ml-[15px]"
                                )}
                              >
                                {c.character?.imagesMultisize &&
                                c.character?.imagesMultisize.length > 0 ? (
                                  <img
                                    alt={c.character?.json?.name}
                                    className={clsx(
                                      "rounded-full object-cover"
                                    )}
                                    src={c.character?.imagesMultisize[0].large}
                                  />
                                ) : null}
                              </div>
                            </div>
                            <div
                              className={clsx(
                                "md:hidden flex w-[calc(50vw-420px)] min-w-[120px] md:mr-0 mr-[20px] transition-all duration-500 justify-center flex"
                              )}
                            >
                              <div
                                className={clsx(
                                  "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex flex-shrink-0 ml-[15px]"
                                )}
                              >
                                {c.character?.imagesMultisize &&
                                c.character?.imagesMultisize.length > 0 ? (
                                  <img
                                    alt={c.character?.json?.name}
                                    className={clsx(
                                      "rounded-full object-cover"
                                    )}
                                    src={c.character?.imagesMultisize[0].large}
                                  />
                                ) : null}
                              </div>
                            </div>
                            <div className="max-w-[715px] flex flex-row md:ml-[30px]">
                              <div className="flex-shrink-0 mr-[20px] md:max-w-[300px] max-w-full">
                                {c.character?.summary ? (
                                  <span className="italic">
                                    {c.character.summary}
                                  </span>
                                ) : (
                                  <JSONToText data={c.character?.json ?? {}} />
                                )}
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
                    </a>
                  </div>
                </div>
                <div className="flex flex-row w-full justify-center">
                  <div className="flex flex-row w-full max-w-[715px]">
                    <div className="flex flex-row mt-[10px]">
                      <div className="flex flex-row rounded-lg dark:bg-darkMainSurcaceTertiary bg-gray-200 items-center">
                        <div
                          className={clsx(
                            "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
                          )}
                        >
                          <UpvoteIcon />
                        </div>
                        <span className="mx-[5px]">{c.thread.votes ?? 0}</span>
                        <div
                          className={clsx(
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreFeedLayout;
