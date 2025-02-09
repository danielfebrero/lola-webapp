import { useEffect } from "react";
import { useParams } from "react-router";

import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import JSONToText from "../../components/JSONToText";
import { setAdminAnalytics } from "../../store/features/analytics/analyticsSlice";

const AnalyticsPage: React.FC = () => {
  const params = useParams();

  const { getAdminAnalytics, socketConnection } = useWebSocket({});

  const analytics = useAppSelector((state) => state.analytics);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      if (params.type === "admin") {
        dispatch(setAdminAnalytics({}));
        getAdminAnalytics();
      }
    }
  }, [params.type, socketConnection]);
  return (
    <div className="h-[calc(100vh-70px)] overflow-y-scroll no-scrollbar">
      <JSONToText data={analytics} />
    </div>
  );
};

export default AnalyticsPage;
