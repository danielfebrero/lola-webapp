import "./ReportView.css";
import JSONToText from "../../components/JSONToText";
import Loading from "../../components/Loading";

interface ReportViewProps {
  type: "character" | "story";
  id?: string | null;
  json?: Record<string, any>;
  isProcessing: boolean;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  return (
    <div id="ReportViewContainer">
      {props.isProcessing ? (
        <Loading />
      ) : !props.json ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <JSONToText data={props.json} />
      )}
    </div>
  );
};

export default ReportView;
