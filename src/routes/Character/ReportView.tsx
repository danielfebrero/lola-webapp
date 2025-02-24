import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import clsx from "clsx";

import JSONToText from "../../components/JSONToText";
import Loading from "../../components/Loading";
import { ImagesMultisize } from "../../types/characters";
import TransitionImage from "../../components/TransitionImage";
import CharacterProfileImageDropdown from "../../components/CharacterProfileImageDropdown";
import LoadingIcon from "../../icons/loading";
import Button from "../../components/Button";

interface ReportViewProps {
  type: "character";
  id?: string | null;
  json?: Record<string, any>;
  isProcessing: boolean;
  isImageGenerating: boolean;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
  avatar?: ImagesMultisize;
  summary?: string;
  isImageUploading?: boolean;
  isOwner?: boolean;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  const [json, setJson] = useState<Record<string, any>>({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const imageDropdownTriggerRef = useRef<HTMLDivElement>(null);
  const [showImageDropdown, setShowImageDropdown] = useState<boolean>(false);

  useEffect(() => {
    try {
      const tmpJson = JSON.parse(JSON.stringify(props.json));
      if (tmpJson.name) delete tmpJson.name;
      setJson(tmpJson);
    } catch (e) {}
  }, [props.json]);

  return (
    <div id="ReportViewContainer">
      {!props.json && !props.isProcessing ? (
        <div className="text-center mt-[50px]">
          {t("Nothing to show here yet")}
        </div>
      ) : (
        <div>
          <div className="flex flex-row mb-[20px] pt-[30px] md:px-[30px]">
            <div
              className={clsx(
                {
                  "animate-pulse rounded-full bg-slate-200":
                    !props.images || props.images?.length === 0,
                },
                "h-[120px] w-[120px]  items-center flex"
              )}
            >
              {props.imagesMultisize && props.imagesMultisize.length > 0 ? (
                <>
                  <div
                    ref={imageDropdownTriggerRef}
                    onClick={() =>
                      props.isOwner
                        ? setShowImageDropdown((prev) => !prev)
                        : null
                    }
                  >
                    <TransitionImage
                      className={clsx(
                        { "cursor-pointer": props.isOwner },
                        "rounded-full object-cover"
                      )}
                      src={
                        props.avatar?.large ?? props.imagesMultisize[0].large
                      }
                    />
                    {props.isImageUploading && (
                      <div className="mt-[-120px] z-10">
                        <LoadingIcon />
                      </div>
                    )}
                  </div>
                  {showImageDropdown && props.id && (
                    <CharacterProfileImageDropdown
                      hide={() => setShowImageDropdown(false)}
                      triggerRef={imageDropdownTriggerRef}
                      threadId={props.id}
                    />
                  )}
                </>
              ) : null}
            </div>
            <div className=" md:ml-[40px] ml-[20px] content-center">
              <span
                className={clsx(
                  { "animate-pulse": props.isProcessing },
                  "font-bold text-4xl"
                )}
              >
                {props.json?.name}
              </span>
              {props.isOwner && (
                <div className="flex flex-row mt-[15px]">
                  <Button
                    onClick={() =>
                      navigate(`/story/new?characterId=${props.id}`)
                    }
                  >
                    {t("New story")}
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/game/new?characterId=${props.id}`)
                    }
                    className="ml-[10px]"
                  >
                    {t("New game")}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {props.isProcessing && !props.json ? (
            <Loading />
          ) : (
            <div className="md:mt-[60px] mt-[40px] md:ml-[20px] pb-[40px]">
              <div className="mb-[20px]">{props.summary}</div>
              <JSONToText data={json} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportView;
