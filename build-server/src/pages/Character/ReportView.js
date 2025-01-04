import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import "./ReportView.css";
import JSONToText from "../../components/JSONToText";
import Loading from "../../components/Loading";
const ReportView = (props) => {
    const [json, setJson] = useState({});
    const { t } = useTranslation();
    useEffect(() => {
        const tmpJson = { ...props.json };
        if (tmpJson.name)
            delete tmpJson.name;
        setJson(tmpJson);
    }, [props.json]);
    return (_jsx("div", { id: "ReportViewContainer", children: !props.json && !props.isProcessing ? (_jsx("div", { className: "text-center mt-[50px]", children: t("Nothing to show here yet") })) : (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-row mb-[20px]", children: [_jsxs("div", { className: clsx({
                                "animate-pulse": !props.images || props.images?.length === 0,
                            }, "h-[120px] w-[120px] rounded-full bg-slate-200 items-center flex"), children: [props.imagesMultisize && props.imagesMultisize.length > 0 ? (_jsx("img", { className: "rounded-full object-cover", src: props.imagesMultisize[0].large })) : null, props.images &&
                                    props.images.length > 0 &&
                                    (!props.imagesMultisize || props.imagesMultisize.length === 0) ? (_jsx("img", { className: "rounded-full object-cover", src: props.images[0] })) : null] }), _jsx("span", { className: "font-bold text-4xl ml-[10px] content-center", children: props.json?.name })] }), props.isProcessing ? _jsx(Loading, {}) : _jsx(JSONToText, { data: json })] })) }));
};
export default ReportView;
