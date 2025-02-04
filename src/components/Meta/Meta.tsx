import { useEffect } from "react";

interface MetaProps {
  title?: string;
}
const Meta: React.FC<MetaProps> = (props) => {
  useEffect(() => {
    document.title = props.title
      ? props.title +
        " on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."
      : "Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator.";
  }, [props.title]);
  return <></>;
};

export default Meta;
