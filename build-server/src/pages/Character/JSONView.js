import { jsx as _jsx } from "react/jsx-runtime";
import ReactJson from "react-json-view";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
const JSONView = (props) => {
    const { t } = useTranslation();
    return (_jsx("div", { children: props.isProcessing ? (_jsx(Loading, {})) : !props.json ? (_jsx("div", { className: "text-center mt-[50px]", children: t("Nothing to show here yet") })) : (_jsx(ReactJson, { src: props.json, theme: "bright:inverted", collapsed: false, enableClipboard: true, displayObjectSize: false, displayDataTypes: false })) }));
};
export default JSONView;
