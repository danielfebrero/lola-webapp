import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const SilentRenew: React.FC = () => {
  const auth = useAuth();

  useEffect(() => {
    auth.signinSilent();
  }, []);

  return <div className="w-full text-center">Logging in progress...</div>;
};

export default SilentRenew;
