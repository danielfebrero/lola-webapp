import { useEffect } from "react";

interface MetaProps {
  title?: string;
}
const Meta: React.FC<MetaProps> = (props) => {
  useEffect(() => {
    document.title = props.title ?? "Lola";
  }, [props.title]);
  return <></>;
};

export default Meta;
