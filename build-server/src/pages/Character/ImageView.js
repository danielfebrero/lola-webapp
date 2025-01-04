import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
const ImageView = (props) => {
    const { t } = useTranslation();
    const [selectedImg, setSelectedImg] = useState(props.imagesMultisize?.[0]?.original ?? props.images?.[0] ?? "");
    useEffect(() => {
        setSelectedImg(props.imagesMultisize?.[0]?.original ?? props.images?.[0] ?? "");
    }, [props.imagesMultisize, props.images]);
    return (_jsx("div", { children: props.isImageGenerating &&
            (!props.images || props.images?.length === 0) &&
            (!props.imagesMultisize || props.imagesMultisize?.length === 0) ? (_jsx(Loading, {})) : props.id === "new" ? (_jsx("div", { className: "text-center mt-[50px]", children: t("Nothing to show here yet") })) : props.imagesMultisize && props.imagesMultisize.length > 0 ? (_jsxs("div", { className: "flex flex-col", children: [_jsx("img", { src: selectedImg }), _jsxs("div", { className: "grid grid-cols-4 h-auto w-auto", children: [props.isImageGenerating ? (_jsx("div", { className: "animate-pulse bg-slate-200" })) : null, props.imagesMultisize.map((img) => (_jsx("img", { src: img.large, className: "w-full h-full", onClick: () => setSelectedImg(img.original) }, img.large)))] })] })) : props.images && props.images.length > 0 ? (_jsxs("div", { className: "flex flex-col", children: [_jsx("img", { src: selectedImg }), _jsxs("div", { className: "grid grid-cols-4 h-auto w-auto", children: [props.isImageGenerating ? (_jsx("div", { className: "animate-pulse bg-slate-200" })) : null, props.images.map((img) => (_jsx("img", { src: img, className: "w-full h-full", onClick: () => setSelectedImg(img) }, img)))] })] })) : null }));
};
export default ImageView;
