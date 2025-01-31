import clsx from "clsx";
import { useState } from "react";

import CloseIcon from "../../icons/close";
import useGA from "../../hooks/useGA";
import ImageSlider from "../ImageSlider";

interface ImageViewerProps {
  images: ImageSearch[];
}

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  const [imageViewingIdx, setImageViewingIdx] = useState<number | null>(null);

  const { sendEvent } = useGA();

  return (
    <div>
      <ImageSlider
        images={props.images}
        imageViewingIdx={imageViewingIdx}
        hide={() => setImageViewingIdx(null)}
      />
      <div className="flex flex-row no-scrollbar overflow-x-scroll">
        {props.images?.map((img, idx) => (
          <div
            onClick={() => {
              setImageViewingIdx(idx);
              sendEvent("clicked_on_image_from_image_viewer");
            }}
            key={img.original}
            className="h-[100px] flex-shrink-0 snap-center cursor-pointer"
          >
            <img
              src={img.thumbnail}
              className="h-[100px] object-cover"
              alt={img.entity}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
