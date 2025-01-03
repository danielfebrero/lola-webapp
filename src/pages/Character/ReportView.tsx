import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import "./ReportView.css";
import JSONToText from "../../components/JSONToText";
import Loading from "../../components/Loading";

interface ReportViewProps {
  type: "character";
  id?: string | null;
  json?: Record<string, any>;
  isProcessing: boolean;
  isImageGenerating: boolean;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  const [json, setJson] = useState<Record<string, any>>({});
  const { t } = useTranslation();

  useEffect(() => {
    const tmpJson = { ...props.json };
    if (tmpJson.name) delete tmpJson.name;
    setJson(tmpJson);
  }, [props.json]);

  return (
    <div id="ReportViewContainer">
      {!props.json && !props.isProcessing ? (
        <div className="text-center mt-[50px]">
          {t("Nothing to show here yet")}
        </div>
      ) : (
        <div>
          <div className="flex flex-row mb-[20px]">
            <div
              className={clsx(
                {
                  "animate-pulse": !props.images || props.images?.length === 0,
                },
                "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex"
              )}
            >
              {props.imagesMultisize && props.imagesMultisize.length > 0 ? (
                <img
                  className="rounded-full object-cover"
                  src={props.imagesMultisize[0].large}
                />
              ) : null}
              {props.images &&
              props.images.length > 0 &&
              (!props.imagesMultisize || props.imagesMultisize.length === 0) ? (
                <img
                  className="rounded-full object-cover"
                  src={props.images[0]}
                />
              ) : null}
            </div>
            <span className="font-bold text-4xl ml-[10px] content-center">
              {props.json?.name}
            </span>
          </div>
          {props.isProcessing ? <Loading /> : <JSONToText data={json} />}
        </div>
      )}
    </div>
  );
};

export default ReportView;
