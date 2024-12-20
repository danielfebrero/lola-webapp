import { useState, useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

interface CharacterPageProps {
  characterId?: string;
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const [characterId, setCharacterId] = useState<string | undefined>(
    params.characterId
  );
  const dispatch = useAppDispatch();

  const [selectedRightViewType, setSelectedRightViewType] = useState<
    "report" | "json" | "image"
  >("report");

  const handleViewTypeChange = (viewType: "report" | "json" | "image") => {
    setSelectedRightViewType(viewType);
  };

  useEffect(() => {
    params.characterId && setCharacterId(params.characterId);
  }, [params.characterId]);

  useEffect(() => {
    props.characterId && setCharacterId(props.characterId);
  }, [props.characterId]);

  useEffect(() => {
    const mainId = "mainId";
    if (props.selected?.type === "main") setCharacterId(mainId);
  }, [props.selected]);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "character", objectId: characterId })
    );
  }, [characterId]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-borderColor w-1/2 pr-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="grow overflow-y-scroll">
          <Chat type="character" id={characterId} />
        </div>
        <SendChatInput
          type="character"
          id={characterId}
          isChatInputAvailable={false}
        />
      </div>

      <div className="grow w-1/2 pl-5 flex items-center flex-col">
        <div className="bg-lightGray p-[5px] rounded-lg w-fit flex flex-row">
          {["report", "JSON", "image"].map((viewType) => (
            <>
              <div
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
                  )
                }
                className={clsx(
                  "cursor-pointer",
                  "pl-[20px] pr-[20px] pt-[5px] pb-[5px]",
                  "rounded-lg",
                  {
                    "text-textPrimary border border-borderLight bg-white":
                      selectedRightViewType === viewType.toLowerCase(),
                    "text-gray-400":
                      selectedRightViewType !== viewType.toLowerCase(),
                  }
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </div>
            </>
          ))}
        </div>
        <div className="mt-4">
          {selectedRightViewType === "report" && (
            <div>
              <ReportView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "json" && (
            <div>
              <JSONView type="character" id={characterId} />
            </div>
          )}
          {selectedRightViewType === "image" && (
            <div>
              <ImageView type="character" id={characterId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
