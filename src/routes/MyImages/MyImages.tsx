import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

import Meta from "../../components/Meta";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import useGA from "../../hooks/useGA";
import ImageSlider from "../../components/ImageSlider";
import useAPI from "../../hooks/useAPI";
import { setMyImages } from "../../store/features/user/userSlice";

const MyImagesPage: React.FC = () => {
  const { t } = useTranslation();
  const [imageViewingUrl, setImageViewingUrl] = useState<string | null>(null);
  const { images } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const auth = useAuth();

  const imagesMultisize = images?.map((i) => i.image_url);

  const { getMyImages } = useAPI();
  const { sendEvent } = useGA();

  useEffect(() => {
    dispatch(setMyImages([]));
    if (!auth.user?.access_token) return;
    getMyImages();
  }, [auth.user?.access_token]);

  return (
    <>
      <Meta title={t("My images")} />
      <ImageSlider
        images={imagesMultisize}
        imageViewingUrl={imageViewingUrl}
        hide={() => setImageViewingUrl(null)}
      />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            <div className="grid md:grid-cols-5 grid grid-cols-2 gap-4">
              {imagesMultisize?.map((i) => (
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

export default MyImagesPage;
