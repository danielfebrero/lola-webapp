import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

const LoginSuccess: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.activeNavigator === "signinRedirect") {
      auth.signinSilent().then(() => {
        navigate("/");
      });
    }
  }, [auth, navigate]);
  return <></>;
};

export default LoginSuccess;
