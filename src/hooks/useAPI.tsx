import { useAuth } from "react-oidc-context";
import useCookie from "./useCookie";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeIsFromDataLoading,
  setChatLogs,
} from "../store/features/app/appSlice";

const API_URL =
  process.env.NODE_ENV === "development" ||
  window.location.origin !== "https://lola.la"
    ? "https://devapi.lola.la/dev"
    : "https://prodapi.lola.la/prod";

export const useAPI = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const cookie = useCookie();
  const { mode } = useAppSelector((state) => state.app);

  const getThreads = async () => {
    try {
      const response = await fetch(`${API_URL}/threads?mode=${mode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token:
            auth?.isAuthenticated && auth.user?.id_token
              ? auth.user?.id_token
              : "",
          cookie,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching threads: ${response.statusText}`);
      }

      const data = await response.json();
      console.log({ data });
      dispatch(removeIsFromDataLoading("threads"));
      dispatch(setChatLogs(data));
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getThreads,
  };
};
