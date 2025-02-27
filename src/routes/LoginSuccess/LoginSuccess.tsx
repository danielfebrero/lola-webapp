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
      window.location.origin === "https://fabularius.ai" ||
      window.location.origin === "https://dev.fabularius.ai"
    ) {
      if (auth.isAuthenticated) {
        dispatch(setIsDataLoaded(false));
        navigate("/");
      }
    }
  }, [auth]);
  return (
    <>
      <Meta title={"Login"} />
      <div className="h-[calc(100vh-70px)]">
        <div className="w-full text-center">Logging in progress...</div>
      </div>
    </>
  );
};

export default LoginSuccess;
