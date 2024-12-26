import ReactJson from "react-json-view";

import Loading from "../../components/Loading";

interface JSONViewProps {
  type: "character";
  id?: string | null;
  json?: Object;
  isProcessing: boolean;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  return (
    <div>
      {props.isProcessing ? (
        <Loading />
      ) : !props.json ? (
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
