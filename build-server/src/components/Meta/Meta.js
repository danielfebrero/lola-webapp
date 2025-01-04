import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
const Meta = (props) => {
    useEffect(() => {
        document.title = props.title ?? "Lola";
    }, [props.title]);
    return _jsx(_Fragment, {});
};
export default Meta;
