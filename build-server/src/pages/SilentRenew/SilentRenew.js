import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
const SilentRenew = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.user?.refresh_token && !auth.isAuthenticated) {
            auth.signinSilent();
        }
        else {
            navigate("/");
        }
    }, [auth]);
    return _jsx("div", { className: "w-full text-center", children: "Logging in progress..." });
};
export default SilentRenew;
