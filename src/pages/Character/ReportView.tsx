import Markdown from "markdown-to-jsx";

import "./ReportView.css";

interface ReportViewProps {
  type: "character" | "story";
  id?: string;
  markdown?: string;
}

const ReportView: React.FC<ReportViewProps> = (props) => {
  return (
    <div id="ReportViewContainer">
      {!props.markdown ? (
        <div className="text-center mt-[50px]">Nothing to show here yet</div>
      ) : (
        <Markdown>{props.markdown}</Markdown>
      )}
    </div>
  );
};

export default ReportView;
