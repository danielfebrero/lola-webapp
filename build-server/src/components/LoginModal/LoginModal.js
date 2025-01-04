import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { useAuth } from "react-oidc-context";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import { toggleLoginModal } from "../../store/features/app/appSlice";
const LoginModal = () => {
    const { isLoginModalOpen } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();
    const auth = useAuth();
    return (_jsxs("div", { className: clsx({ hidden: !isLoginModalOpen }, "bg-white rounded-lg py-5 w-auto"), children: [_jsxs("div", { className: "flex justify-between items-center pb-5 px-5 border-b border-borderBlack", children: [_jsx("div", { className: "text-lg font-semibold pr-[20px]", children: "Login or signup" }), _jsx("div", { onClick: () => dispatch(toggleLoginModal()), className: "h-[18px] w-[18px] cursor-pointer", children: _jsx(CloseIcon, {}) })] }), _jsx("div", { className: "flex flex-row", children: !auth.isAuthenticated ? (_jsx("button", { onClick: () => auth.signinRedirect(), className: "bg-buttonGreen text-white h-[50px] w-[220px] rounded-lg flex justify-center items-center mx-[40px] mt-[20px]", children: "Login or signup" })) : (_jsx("div", { className: "mt-[20px] text-center w-full", children: "Login successful" })) })] }));
};
export default LoginModal;
