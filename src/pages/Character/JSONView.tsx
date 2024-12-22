import ReactJson from "react-json-view";

import "./JSONView.css";

interface JSONViewProps {
  type: "character";
  id?: string;
  json?: Object;
  isProcessing: boolean;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {!props.json ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : props.isProcessing ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
        </>
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
