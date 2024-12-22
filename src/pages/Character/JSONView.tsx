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
      {props.isProcessing ? (
        <div className="p-4 max-w-sm w-full mx-auto mt-[50px]">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : !props.json ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <div className="">
          <ReactJson
            src={props.json}
            theme="bright:inverted"
            collapsed={false}
            enableClipboard={true}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </div>
      )}
    </div>
  );
};

export default JSONView;
