import ReactJson from "react-json-view";

import "./JSONView.css";

interface JSONViewProps {
  type: "character";
  id?: string;
  json?: Object;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {!props.json ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <ReactJson
          src={props.json}
          theme="bright:inverted"
          collapsed={false}
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
        />
      )}
    </div>
  );
};

export default JSONView;
