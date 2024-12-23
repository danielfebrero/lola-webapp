import Loading from "../../components/Loading";

interface ImageViewProps {
  type: "character" | "story";
  id?: string | null;
  isProcessing: boolean;
  images: string[];
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  return (
    <div>
      {props.isProcessing ? (
        <Loading />
      ) : props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <img src={props.images[0]} alt="Dani" />
      )}
    </div>
  );
};

export default ImageView;
