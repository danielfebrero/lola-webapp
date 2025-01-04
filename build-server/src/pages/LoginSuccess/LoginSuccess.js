import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";
import { useAppDispatch } from "../../store/hooks";
import { setIsDataLoaded } from "../../store/features/app/appSlice";
import Meta from "../../components/Meta";
const LoginSuccess = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (auth.isAuthenticated) {
            dispatch(setIsDataLoaded(false));
            navigate("/");
        }
    }, [auth]);
    return (_jsxs(_Fragment, { children: [_jsx(Meta, { title: "Login" }), _jsx("div", { className: "w-full text-center", children: "Logging in progress..." })] }));
};
export default LoginSuccess;
