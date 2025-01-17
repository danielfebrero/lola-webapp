import { useTranslation } from "react-i18next";

import Meta from "../../components/Meta";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";
import { Link } from "react-router";
import UpvoteIcon from "../../icons/upvote";
import DownvoteIcon from "../../icons/downvote";

interface ExplorePageProps {
  type: string;
}

const content = [
  {
    threadId: "abcdef",
    type: "story",
    title: "Visiting New-York",
    messages: [
      {
        role: "user",
        content: "Lola visits New York with her friend Flora.",
      },
      {
        role: "assistant",
        content:
          "Chapitre 1 : Un départ inattendu\n\nLola se sentait nerveuse au bord du trottoir, son sac à dos pesant sur ses épaules. Elle regarda autour d'elle, cherchant Flora qui devait arriver d'une minute à peine. La gare routière de Port Authority était en effervescence, les gens déchargeant leurs bagages et les porteurs de valises s'éloignant en courant vers les taxis. Elle espérait que Flora n'avait pas oublié leur rendez-vous.",
      },
    ],
  },
  {
    threadId: "ghijkl",
    type: "story",
    title: "A Day at the Beach",
    messages: [
      {
        role: "user",
        content: "Alex and Jamie plan a surprise picnic on the beach.",
      },
      {
        role: "assistant",
        content:
          "It was an unexpectedly sunny day as Alex drove along the coast, the sparkling ocean stretching out on one side and the rugged cliffs on the other. Jamie had already set up a cozy spot on the soft sands, with a colorful blanket spread and a wicker basket filled with delicious treats. The sound of crashing waves mingled with their laughter, making it a memory to treasure for a long time.",
      },
    ],
  },
  {
    threadId: "mnopqr",
    type: "story",
    title: "Midnight Coding",
    messages: [
      {
        role: "user",
        content: "Sam is burning the midnight oil to fix a critical bug.",
      },
      {
        role: "assistant",
        content:
          "Under the dim glow of a single desk lamp, Sam typed furiously at the keyboard. The error logs scrolled endlessly as the codebase revealed yet another elusive bug. Determined to solve the issue before sunrise, Sam methodically traced each function, feeling both the pressure of the deadline and a surge of determination. Every resolved line of code felt like a small victory against the relentless tide of technical challenges.",
      },
    ],
  },
  {
    threadId: "stuvwx",
    type: "story",
    title: "Mountain Retreat",
    messages: [
      {
        role: "user",
        content: "Jordan escapes to the mountains to find peace.",
      },
      {
        role: "assistant",
        content:
          "In the crisp mountain air, Jordan set off along a rugged trail, the peaks standing sentinel against the vast, blue sky. With each step, a sense of freedom replaced the urban chaos left behind. The rustle of pine needles and distant bird calls provided a natural symphony, and by the time the sun began to set, painting the landscape in hues of gold and crimson, Jordan felt completely at home in nature.",
      },
    ],
  },
  {
    threadId: "yzabcd",
    type: "story",
    title: "Urban Exploration",
    messages: [
      {
        role: "user",
        content: "Riley discovers hidden gems in the heart of the city.",
      },
      {
        role: "assistant",
        content:
          "Riley wandered through narrow alleys lined with graffiti and murals that told stories of the city's vibrant culture. Each turn revealed a new secret—a tucked-away café, a rooftop garden bursting with life, and whispers of history echoing off old brick walls. The urban labyrinth offered surprises at every corner, turning a simple walk into an adventure of discovery and wonder.",
      },
    ],
  },
];

const ExplorePage: React.FC<ExplorePageProps> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t(props.type === "best" ? "Best content" : "Latest")} />
      <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col">
            {content.map((c) => (
              <div className="p-[10px] cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurfaceSecondary border-b border-borderColor dark:border-darkBorderColor">
                <Link to={"/" + c.type + "/" + c.threadId}>
                  <div className="flex flex-col max-w-[715px] max-h-[300px] h-auto overflow-hidden">
                    <div className="font-bold mb-[20px]">{c.title}</div>
                    {c.messages?.map((message, idx) =>
                      message.role === "user" ? (
                        <div
                          className="flex flex-row justify-end mb-[20px]"
                          key={message.content ?? idx}
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
                        <div className="" key={message.content}>
                          <Markdown>{message.content}</Markdown>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex flex-row mt-[10px]">
                    <div className="flex flex-row rounded-lg dark:bg-darkMainSurcaceTertiary bg-lightGray items-center">
                      <div className="w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full">
                        <UpvoteIcon />
                      </div>
                      <span className="mx-[5px]">0</span>
                      <div className="w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full">
                        <DownvoteIcon />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
