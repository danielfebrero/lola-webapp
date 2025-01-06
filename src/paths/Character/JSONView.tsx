import ReactJson from "react-json-view";
import { useTranslation } from "react-i18next";

import Loading from "../../components/Loading";

interface JSONViewProps {
  type: "character";
  id?: string | null;
  json?: Object;
  isProcessing: boolean;
}

const JSONView: React.FC<JSONViewProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div>
      {props.isProcessing ? (
        <Loading />
      ) : !props.json ? (
        <div className="text-center mt-[50px]">
          {t("Nothing to show here yet")}
        </div>
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
