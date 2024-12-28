import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

import { useAppDispatch } from "../../store/hooks";
import { setIsDataLoaded } from "../../store/features/app/appSlice";

const LoginSuccess: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(setIsDataLoaded(false));
      navigate("/");
    }
  }, [auth]);
  return <div className="w-full text-center">Logging in progress...</div>;
};

export default LoginSuccess;
