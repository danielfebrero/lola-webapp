import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import useGA from "../../hooks/useGA";
import ImageSlider from "../../components/ImageSlider";
import { setExploreImages } from "../../store/features/app/appSlice";

const ExploreImagesPage: React.FC = (props) => {
  const { t } = useTranslation();
  const [imageViewingUrl, setImageViewingUrl] = useState<string | null>(null);
  const { explore } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const { getExploreImages, socketConnection } = useWebSocket({});

  const { sendEvent } = useGA();

  useEffect(() => {
    dispatch(setExploreImages([]));
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      getExploreImages();
    }
  }, [socketConnection?.readyState]);

  return (
    <>
      <Meta title={t("Images")} />
      <ImageSlider
        images={explore.images}
        imageViewingUrl={imageViewingUrl}
        hide={() => setImageViewingUrl(null)}
      />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            <div className="grid md:grid-cols-5 grid grid-cols-2 gap-4">
              {explore.images?.map((i, idx) => (
                <div
                  className="w-[120px] h-[120px] cursor-pointer"
                  onClick={() => {
                    setImageViewingUrl(i.original);
                    sendEvent("clicked_on_image_from_explore_image");
                  }}
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
