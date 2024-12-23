import imageDani from "../../dani.webp";

interface ImageViewProps {
  type: "character" | "story";
  id?: string | null;
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  return (
    <div>
      {props.id === "new" ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <img src={imageDani} alt="Dani" />
      )}
    </div>
  );
};

export default ImageView;
