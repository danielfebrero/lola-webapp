import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

interface ImageViewProps {
  type: "character" | "story";
  id?: string | null;
  isProcessing: boolean;
  images?: string[];
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  const [selectedImg, setSelectedImg] = useState<string>(
    props.images?.[0] ?? ""
  );

  useEffect(() => {
    setSelectedImg(props.images?.[0] ?? "");
  }, [props.images]);
  return (
    <div>
      {props.isProcessing ? (
        <Loading />
      ) : props.id === "new" || !props.images || props.images.length === 0 ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <div className="flex flex-col">
          <img src={selectedImg} />
          <div className="grid grid-cols-4 h-[150px] w-auto">
            {props.images.map((img) => (
              <img
                key={img}
                src={img}
                height={150}
                width={150}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageView;
