import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import clsx from "clsx";

import CloseIcon from "../../icons/close";
import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector } from "../../store/hooks";

const ExploreImagesPage: React.FC = (props) => {
  const { t } = useTranslation();
  const [imageViewing, setImageViewing] = useState<string | null>(null);
  const { explore } = useAppSelector((state) => state.app);

  const { getExploreImages, socketConnection } = useWebSocket({});

  useEffect(() => {
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      getExploreImages();
    }
  }, [socketConnection?.readyState]);

  return (
    <>
      <Meta title={t("Images")} />
      <div
        className={clsx(
          { hidden: !imageViewing },
          "fixed h-[calc(100vh-60px)] w-[calc(100vw-60px)] top-[30px] left-[30px] bg-slate-200"
        )}
      >
        <div
          onClick={() => setImageViewing(null)}
          className="fixed top-[40px] right-[40px] h-[48px] w-[48px] cursor-pointer text-textSecondary dark:text-darkTextSecondary"
        >
          <CloseIcon />
        </div>
        {imageViewing && (
          <img
            className="h-full w-full object-contain"
            src={imageViewing}
            alt={imageViewing}
          />
        )}
      </div>
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            <div className="grid md:grid-cols-5 grid grid-cols-3 gap-4">
              {explore.images?.map((i) => (
                <div
                  className="w-full cursor-pointer"
                  onClick={() => setImageViewing(i.original)}
                >
                  <img src={i.large} alt={i.original} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreImagesPage;
