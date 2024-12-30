import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const SilentRenew: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user?.refresh_token && !auth.isAuthenticated) {
      auth.signinSilent();
    } else {
      navigate("/");
    }
  }, [auth]);

  return <div className="w-full text-center">Logging in progress...</div>;
};

export default SilentRenew;
