import { useEffect } from "react";
import { useParams } from "react-router";

import useWebSocket from "../../hooks/useWebSocket";
import { useAppSelector } from "../../store/hooks";
import JSONToText from "../../components/JSONToText";

const AnalyticsPage: React.FC = () => {
  const params = useParams();

  const { getAdminAnalytics, socketConnection } = useWebSocket({});

  const analytics = useAppSelector((state) => state.analytics);

  useEffect(() => {
    if (socketConnection?.readyState === socketConnection?.OPEN) {
      if (params.type === "admin") {
        getAdminAnalytics();
      }
    }
  }, [params.type, socketConnection]);
  return (
    <>
      <JSONToText data={analytics} />
    </>
  );
};

export default AnalyticsPage;
