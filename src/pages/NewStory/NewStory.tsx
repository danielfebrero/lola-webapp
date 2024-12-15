import { useState } from "react";

import imageDani from "../../dani.webp";
import imageLola from "../../lola.jpeg";

import PlusIcon from "../../icons/plus";
import CloseIcon from "../../icons/close";
import clsx from "clsx";

const characters = [
  {
    id: "random",
    label: "Random",
    image: imageDani,
  },
  {
    id: "2329890kj09-claire",
    label: "Claire",
    image: imageLola,
  },
  {
    id: "dani01",
    label: "Dani",
    image: imageDani,
  },
  {
    id: "2329890kj09-claire",
    label: "Claire",
    image: imageLola,
  },
  {
    id: "dani01",
    label: "Dani",
    image: imageDani,
  },
];

const NewStoryPage: React.FC = () => {
  const [showAIInput, setShowAIInput] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            { hidden: !showAIInput },
            "absolute top-0 w-[calc(100%-260px)] h-full bg-white border flex flex-col justify-center items-center"
          )}
        >
          <div className="flex justify-end w-[60%]">
            <div
              className="h-[24px] w-[24px] m-[10px] cursor-pointer"
              onClick={() => setShowAIInput(false)}
            >
              <CloseIcon />
            </div>
          </div>
          <input
            type="text"
            placeholder="Dani's dentist, she is a sexy 34yo petite brunette"
            className="w-[60%] outline-none border rounded-full p-[10px]"
            onKeyDown={(e) => e.key === "Enter" && setShowAIInput(false)}
          />
        </div>
        <div className="font-semibold text-lg mb-[20px]">Characters</div>
        <div className="flex flex-row">
          {characters.map((char) => (
            <div className="flex flex-col items-center mx-[10px] cursor-pointer">
              <div className="h-[64px] w-[64px] mb-[10px]">
                <img
                  src={char.image}
                  className="rounded-full h-[64px] w-[64px] object-cover"
                />
              </div>
              <div className="text-textSecondary">{char.label}</div>
            </div>
          ))}
          <div
            className="h-[64px] w-[64px] ml-[10px] mb-[10px] text-textSecondary cursor-pointer"
            onClick={() => setShowAIInput(true)}
          >
            <PlusIcon />
          </div>
        </div>
        <div className="font-semibold text-lg mt-[40px] mb-[20px]">Scene</div>
      </div>
    </div>
  );
};

export default NewStoryPage;
