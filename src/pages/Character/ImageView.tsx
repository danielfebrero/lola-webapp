import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loading from "../../components/Loading";

interface ImageViewProps {
  type: "character" | "story";
  id?: string | null;
  isImageGenerating: boolean;
  images?: string[];
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  const { t } = useTranslation();
  const [selectedImg, setSelectedImg] = useState<string>(
    props.images?.[0] ?? ""
  );

  useEffect(() => {
    setSelectedImg(props.images?.[0] ?? "");
  }, [props.images]);
  return (
    <div>
      {props.isImageGenerating &&
      (!props.images || props.images?.length === 0) ? (
        <Loading />
      ) : props.id === "new" || !props.images || props.images.length === 0 ? (
        <div className="text-center mt-[50px]">
          {t("Nothing to show here yet")}
        </div>
      ) : (
        <div className="flex flex-col">
          <img src={selectedImg} />
          <div className="grid grid-cols-4 h-auto w-auto">
            {props.isImageGenerating ? (
              <div className="animate-pulse bg-slate-200"></div>
            ) : null}
            {props.images.map((img) => (
              <img key={img} src={img} onClick={() => setSelectedImg(img)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageView;
