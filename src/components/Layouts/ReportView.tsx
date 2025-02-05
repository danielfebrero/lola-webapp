import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import JSONToText from "../../components/JSONToText";
import Loading from "../../components/Loading";
import { ImagesMultisize } from "../../types/characters";

interface ReportViewLayoutProps {
  type: "character";
  id?: string | null;
  json?: Record<string, any>;
  isProcessing: boolean;
  isImageGenerating: boolean;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
}

const ReportViewLayout: React.FC<ReportViewLayoutProps> = (props) => {
  const tmpJson = Object.assign({}, props.json);
  if (tmpJson.name) delete tmpJson.name;

  return (
    <div id="ReportViewContainer">
      {!props.json && !props.isProcessing ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <div>
          <div className="flex flex-row mb-[20px] pt-[30px] md:px-[30px]">
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
                  className={clsx(
                    { "animate-pulse": props.isImageGenerating },
                    "rounded-full object-cover"
                  )}
                  src={props.imagesMultisize[0].large}
                />
              ) : null}
              {props.images &&
              props.images.length > 0 &&
              (!props.imagesMultisize || props.imagesMultisize.length === 0) ? (
                <img
                  className={clsx(
                    { "animate-pulse": props.isImageGenerating },
                    "rounded-full object-cover"
                  )}
                  src={props.images[0]}
                />
              ) : null}
            </div>
            <span
              className={clsx(
                { "animate-pulse": props.isProcessing },
                "font-bold text-4xl md:ml-[40px] ml-[20px] content-center"
              )}
            >
              {props.json?.name}
            </span>
          </div>
          {props.isProcessing ? (
            <Loading />
          ) : (
            <div className="md:mt-[60px] mt-[40px] md:ml-[20px] pb-[40px]">
              <JSONToText data={tmpJson} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportViewLayout;
