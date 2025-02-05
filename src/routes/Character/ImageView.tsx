import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { ImagesMultisize } from "../../types/characters";

interface ImageViewProps {
  type: "character" | "story";
  id?: string | null;
  isImageGenerating: boolean;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  const { t } = useTranslation();
  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);
  const [imageViewingIdx, setImageViewingIdx] = useState<number | null>(null);

  useEffect(() => {
    setSelectedImgIdx(0);
  }, [props.imagesMultisize, props.images]);

  return (
    <>
      {props.imagesMultisize && (
        <ImageSlider
          images={props.imagesMultisize}
          imageViewingIdx={imageViewingIdx}
          hide={() => setImageViewingIdx(null)}
        />
      )}
      <div className="w-full">
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
            <img
              src={props.imagesMultisize[selectedImgIdx].original}
              width="1024"
              height="1024"
              onClick={() => setImageViewingIdx(selectedImgIdx)}
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
                  className="w-full h-full"
                  onClick={() => setSelectedImgIdx(idx)}
                />
              ))}
            </div>
          </div>
        ) : props.images && props.images.length > 0 ? (
          <div className="flex flex-col">
            <img
              src={props.images[selectedImgIdx]}
              width="1024"
              height="1024"
              onClick={() => setImageViewingIdx(selectedImgIdx)}
              className="cursor-pointer"
            />
            <div className="grid grid-cols-4 h-auto w-auto">
              {props.isImageGenerating ? (
                <div className="animate-pulse bg-slate-200"></div>
              ) : null}
              {props.images.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  className="w-full h-full"
                  onClick={() => setSelectedImgIdx(idx)}
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
