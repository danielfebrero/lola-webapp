import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
import { useAppSelector } from "../../store/hooks";
const Overlay = (props) => {
    const { isSettingsOpen, isLoginModalOpen } = useAppSelector((state) => state.app);
    return (_jsx("div", { className: clsx({ hidden: !isSettingsOpen && !isLoginModalOpen }, "absolute h-screen w-screen bg-transparentBlack z-50 flex justify-center items-center"), children: props.children }));
};
export default Overlay;
