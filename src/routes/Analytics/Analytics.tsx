import { useEffect } from "react";
import { useParams } from "react-router";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import JSONToText from "../../components/JSONToText";
import { setAdminAnalytics } from "../../store/features/analytics/analyticsSlice";
import useAPI from "../../hooks/useAPI";

const AnalyticsPage: React.FC = () => {
  const params = useParams();

  const { getAdminAnalytics } = useAPI();
  const analytics = useAppSelector((state) => state.analytics);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.type === "admin") {
      dispatch(setAdminAnalytics({}));
      getAdminAnalytics();
    }
  }, [params.type]);
  return (
    <div className="h-[calc(100vh-70px)] overflow-y-scroll no-scrollbar">
      <JSONToText data={analytics} />
    </div>
  );
};

export default AnalyticsPage;
