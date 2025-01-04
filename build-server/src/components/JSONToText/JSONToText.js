import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const JSONToText = ({ data, title }) => {
    /**
     * Recursive function to render JSON objects or arrays.
     */
    const renderData = (value) => {
        if (Array.isArray(value)) {
            // Render arrays
            return (_jsx("ul", { className: "list-disc ml-5", children: value.map((item, index) => (_jsx("li", { children: renderData(item) }, index))) }));
        }
        else if (typeof value === "object" && value !== null) {
            // Render objects
            return (_jsx("div", { className: "ml-5 pl-3", children: Object.entries(value).map(([key, val]) => (_jsx("div", { className: "mb-2", children: val ? (_jsxs(_Fragment, { children: [_jsxs("strong", { children: [capitalize(key), ":"] }), " ", renderData(val)] })) : (_jsx(_Fragment, { children: capitalize(key) })) }, key))) }));
        }
        else {
            // Render primitive values
            return _jsx("span", { children: value?.toString() || "" });
        }
    };
    /**
     * Utility function to capitalize a string.
     */
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (_jsxs("div", { className: "font-sans leading-relaxed", children: [title && (_jsx("h2", { className: "text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-4", children: title })), renderData(data)] }));
};
export default JSONToText;
