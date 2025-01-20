import { useEffect } from "react";
import { useParams } from "react-router";

import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector } from "../../store/hooks";
import JSONToText from "../../components/JSONToText";

const AnalyticsPage: React.FC = () => {
  const params = useParams();

  const { getAdminAnalytics } = useWebSocket({});

  const analytics = useAppSelector((state) => state.analytics);

  useEffect(() => {
    if (params.type === "admin") {
      getAdminAnalytics();
    }
  }, [params.type]);
  return (
    <>
      <JSONToText data={analytics} />
    </>
  );
};

export default AnalyticsPage;
