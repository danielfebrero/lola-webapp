import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Markdown from "markdown-to-jsx";
import { Link } from "react-router";

import JSONToText from "../../components/JSONToText";
import Meta from "../../components/Meta";
import UpvoteIcon from "../../icons/upvote";
import DownvoteIcon from "../../icons/downvote";

interface ExplorePageProps {
  type: string;
}

const content = [
  {
    threadId: "b42c2002-e708-45b2-8228-f0871f73d3a9",
    type: "character",
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
    character: {
      threadId: "b42c2002-e708-45b2-8228-f0871f73d3a9",
      user_id: "",
      mode: "minor",
      created_at: "2025-01-16T13:40:09.222000",
      updated_at: "2025-01-16T13:40:09.222000",
      id: "67890c39d9f0871dfd9bc0ce",
      json: {
        name: "Emily",
        age: 26,
        gender: "woman",
        hair_color: "brown",
        eye_color: "blue",
      },
      images: [
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/b21a5dc8-2b30-4551-8501-297dfe3ce9fa.png",
      ],
      imagesMultisize: [
        {
          original:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/b21a5dc8-2b30-4551-8501-297dfe3ce9fa.png",
          large:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/2b6c36cd-8bb1-47da-a10a-1d828624b2d1.png",
          medium:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/becaee9a-946b-4c88-92b2-f0d902c935ec.png",
          small:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/92e24ea7-51e8-4db0-808f-ad2d67fc3e3b.png",
        },
      ],
    },
  },
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
    type: "character",
    threadId: "2fa66f27-253b-4bb0-9ceb-5ead473f5186",
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
    character: {
      threadId: "2fa66f27-253b-4bb0-9ceb-5ead473f5186",
      user_id: "",
      mode: "minor",
      created_at: "2025-01-16T13:45:01.304000",
      updated_at: "2025-01-16T13:45:01.304000",
      id: "67890d5dc7bdf421cd8148a4",
      json: {
        name: "Jacob",
        age: 31,
        gender: "man",
        eye_color: "bright blue",
        hair_color: "blond",
        beard: "rugged",
      },
      images: [
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/05fc0aed-c80c-4836-a5e3-6d47c4c2d8dd.png",
      ],
      imagesMultisize: [
        {
          original:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/05fc0aed-c80c-4836-a5e3-6d47c4c2d8dd.png",
          large:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/3fc77b87-e2c2-4375-9afa-eb67b14414f1.png",
          medium:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/eee48b5b-397e-404a-92cb-a02bbbd1e395.png",
          small:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/36e155cb-fdce-4f3c-9f8f-ef971e1457cf.png",
        },
      ],
    },
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
    type: "character",
    threadId: "22755b03-bfae-4556-8448-888044a5195d",
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
    character: {
      threadId: "22755b03-bfae-4556-8448-888044a5195d",
      user_id: "",
      mode: "minor",
      created_at: "2025-01-16T18:24:00.371000",
      updated_at: "2025-01-16T18:24:00.371000",
      id: "67894ec00d7cb1bee39af2d3",
      json: {
        name: "Matthew",
        age: 35,
        gender: "man",
        origin: "American",
        veteran_of_war: true,
        war_experienced_in: "Iraq",
        cybernetic_parts: ["arms", "legs", "torso"],
        memory_lingering_from_war: true,
        technology_advancements: true,
        adapted_to_new_life: true,
        servo_whirring_sound: true,
        metallic_sheen_visible: true,
        casual_outfit_worn: true,
        introspective_mood: true,
      },
      images: [
        "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/7b0ee139-bab3-4e70-b035-203df73bf07d.png",
      ],
      imagesMultisize: [
        {
          original:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/7b0ee139-bab3-4e70-b035-203df73bf07d.png",
          large:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/44f3153e-0a12-4391-9cec-763869502e95.png",
          medium:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/fef0620e-a800-4d0a-817a-8bbfa47e8136.png",
          small:
            "https://lola-ai-generated-images-prod.s3.amazonaws.com/images/0ca68a66-2be8-4650-8ffe-d1cbe9f3047b.png",
        },
      ],
    },
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
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col  max-w-[715px] w-screen">
            {content.map((c) => (
              <div className="p-[10px] hover:bg-lightGray rounded-lg dark:hover:bg-darkMainSurfaceSecondary border-b border-borderColor dark:border-darkBorderColor">
                <div className="flex flex-col h-auto overflow-hidden cursor-pointer">
                  <Link to={"/" + c.type + "/" + c.threadId}>
                    <div className="font-bold mb-[10px] text-lg">{c.title}</div>
                    {c.type === "story" &&
                      c.messages?.map((message, idx) =>
                        message.role === "user" ? (
                          <div
                            className="flex flex-row justify-end mb-[10px]"
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
                    {c.type === "character" && (
                      <div className="flex flex-row">
                        <div
                          className={clsx(
                            "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex flex-shrink-0"
                          )}
                        >
                          {c.character?.imagesMultisize &&
                          c.character?.imagesMultisize.length > 0 ? (
                            <img
                              alt={c.character?.json.name}
                              className={clsx("rounded-full object-cover")}
                              src={c.character?.imagesMultisize[0].large}
                            />
                          ) : null}
                          {c.character?.images &&
                          c.character?.images.length > 0 &&
                          (!c.character?.imagesMultisize ||
                            c.character?.imagesMultisize.length === 0) ? (
                            <img
                              alt={c.character?.json.name}
                              className={clsx("rounded-full object-cover")}
                              src={c.character?.images[0]}
                            />
                          ) : null}
                        </div>
                        <div className="flex-shrink-0 mr-[20px]">
                          <JSONToText data={c.character?.json ?? {}} />
                        </div>
                        <div className="hidden md:block">
                          {c.messages?.map((message, idx) =>
                            message.role === "user" ? (
                              <div
                                className="flex flex-row justify-end mb-[10px]"
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
                      </div>
                    )}
                  </Link>
                </div>
                <div className="flex flex-row mt-[10px]">
                  <div className="flex flex-row rounded-lg dark:bg-darkMainSurcaceTertiary bg-gray-200 items-center">
                    <div className="cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full">
                      <UpvoteIcon />
                    </div>
                    <span className="mx-[5px]">0</span>
                    <div className="cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full">
                      <DownvoteIcon />
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
