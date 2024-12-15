import { useState, useEffect } from "react";
import clsx from "clsx";
import { useParams } from "react-router";

import Chat from "../../components/Chat";
import SendChatInput from "../../components/SendChatInput";
import JSONView from "./JSONView";
import ReportView from "./ReportView";
import ImageView from "./ImageView";

interface CharacterPageProps {
  characterId?: string;
  selected?: Record<string, string>;
}

const CharacterPage: React.FC<CharacterPageProps> = (props) => {
  const params = useParams();
  const [characterId, setCharacterId] = useState<string | undefined>(
    params.characterId
  );

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

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-textSecondary w-1/2 pr-5 flex flex-col">
        <div className="grow">
          <Chat type="character" id={characterId} />
        </div>
        <SendChatInput type="character" id={characterId} />
      </div>

      <div className="grow w-1/2 pl-5">
        <div className="mb-2">
          {["report", "JSON", "image"].map((viewType, index, typesArray) => (
            <>
              <span
                key={viewType}
                onClick={() =>
                  handleViewTypeChange(
                    viewType.toLowerCase() as "report" | "json" | "image"
                  )
                }
                className={clsx(
                  "cursor-pointer px-1",
                  selectedRightViewType === viewType.toLowerCase()
                    ? "underline text-gray-500 decoration-gray-500"
                    : ""
                )}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </span>
              <span>{index < typesArray.length - 1 ? " / " : ""}</span>
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
