import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import TransitionImage from "../../components/TransitionImage";
import { ImagesMultisize } from "../../types/characters";
import useAPI from "../../hooks/useAPI";
import clsx from "clsx";

interface ImageViewProps {
  type: "character" | "story";
  id: string | null;
  isImageGenerating: boolean;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
  avatar?: ImagesMultisize;
  isOwner: boolean;
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<ImagesMultisize | null>(
    props.avatar ?? props.imagesMultisize?.[0] ?? null
  );
  const [imageViewingUrl, setImageViewingUrl] = useState<string | null>(null);
  const { setCharacterAvatar } = useAPI();

  useEffect(() => {
    if (
      avatar &&
      props.id &&
      props.avatar?.large !== avatar?.large &&
      props.isOwner
    )
      setCharacterAvatar(props.id, avatar);
  }, [avatar]);

  useEffect(() => {
    setAvatar(props.avatar ?? props.imagesMultisize?.[0] ?? null);
  }, [props.avatar]);

  return (
    <>
      {props.imagesMultisize && (
        <ImageSlider
          images={props.imagesMultisize}
          imageViewingUrl={imageViewingUrl}
          hide={() => setImageViewingUrl(null)}
        />
      )}
      <div id="image-view-container" className="w-full">
        {props.isImageGenerating &&
        (!props.images || props.images?.length === 0) &&
        (!props.imagesMultisize || props.imagesMultisize?.length === 0) ? (
          <Loading />
        ) : !props.id ? (
          <div className="text-center mt-[50px]">
            {t("Nothing to show here yet")}
          </div>
        ) : props.imagesMultisize && props.imagesMultisize.length > 0 ? (
          <div className="flex flex-col">
            <TransitionImage
              fadeOutDuration={150}
              src={(avatar ?? props.imagesMultisize?.[0])?.original}
              width="1024"
              height="1024"
              alt="Avatar"
              onClick={() =>
                setImageViewingUrl(
                  (avatar ?? props.imagesMultisize?.[0])?.original ?? null
                )
              }
              className="cursor-pointer"
            />
            <div className="grid grid-cols-4 h-auto w-auto">
              {props.isImageGenerating ? (
                <div className="animate-pulse bg-slate-200"></div>
              ) : null}
              {props.imagesMultisize.map((img, idx) => (
                <img
                  key={img.large}
                  src={img.large}
                  className={clsx(
                    {
                      "border-4 border-brandMainColor dark:border-darkBrandMainColor":
                        img.large === avatar?.large,
                    },
                    "w-full h-full cursor-pointer object-cover aspect-square"
                  )}
                  onClick={() => {
                    setAvatar(img);
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ImageView;
