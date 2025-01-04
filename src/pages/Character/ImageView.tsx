import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "../../components/Loading";

interface ImageViewProps {
  type: "character" | "story";
  id?: string | null;
  isImageGenerating: boolean;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  const { t } = useTranslation();
  const [selectedImg, setSelectedImg] = useState<string>(
    props.imagesMultisize?.[0]?.original ?? props.images?.[0] ?? ""
  );

  useEffect(() => {
    setSelectedImg(
      props.imagesMultisize?.[0]?.original ?? props.images?.[0] ?? ""
    );
  }, [props.imagesMultisize, props.images]);
  return (
    <div>
      {props.isImageGenerating &&
      (!props.images || props.images?.length === 0) &&
      (!props.imagesMultisize || props.imagesMultisize?.length === 0) ? (
        <Loading />
      ) : props.id === "new" ? (
        <div className="text-center mt-[50px]">
          {t("Nothing to show here yet")}
        </div>
      ) : props.imagesMultisize && props.imagesMultisize.length > 0 ? (
        <div className="flex flex-col">
          <img src={selectedImg} width="1024" height="1024" />
          <div className="grid grid-cols-4 h-auto w-auto">
            {props.isImageGenerating ? (
              <div className="animate-pulse bg-slate-200"></div>
            ) : null}
            {props.imagesMultisize.map((img) => (
              <img
                key={img.large}
                src={img.large}
                className="w-full h-full"
                onClick={() => setSelectedImg(img.original)}
              />
            ))}
          </div>
        </div>
      ) : props.images && props.images.length > 0 ? (
        <div className="flex flex-col">
          <img src={selectedImg} width="1024" height="1024" />
          <div className="grid grid-cols-4 h-auto w-auto">
            {props.isImageGenerating ? (
              <div className="animate-pulse bg-slate-200"></div>
            ) : null}
            {props.images.map((img) => (
              <img
                key={img}
                src={img}
                className="w-full h-full"
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageView;
