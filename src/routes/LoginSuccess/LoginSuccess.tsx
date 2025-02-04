import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

import { useAppDispatch } from "../../store/hooks";
import { setIsDataLoaded } from "../../store/features/app/appSlice";
import Meta from "../../components/Meta";

const LoginSuccess: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      window.location.origin === "https://lola.la" ||
      window.location.origin === "https://dev.lola.la"
    ) {
      window.location.href = window.location.href.replace(
        "lola.la",
        "fabularius.ai"
      );
    } else {
      if (auth.isAuthenticated) {
        dispatch(setIsDataLoaded(false));
        navigate("/");
      }
    }
  }, [auth]);
  return (
    <>
      <Meta title={"Login"} />
      <div className="w-full text-center">Logging in progress...</div>
    </>
  );
};

export default LoginSuccess;
