import clsx from "clsx";
import { useState } from "react";

import CloseIcon from "../../icons/close";

interface ImageViewerProps {
  images: ImageSearch[];
}

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  const [imageViewing, setImageViewing] = useState<string | null>(null);

  return (
    <div>
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
      <div className="flex flex-row no-scrollbar overflow-x-scroll">
        {props.images?.map((img) => (
          <div
            onClick={() => setImageViewing(img.original)}
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
