import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setAdminAnalytics } from "../../store/features/analytics/analyticsSlice";
import useAPI from "../../hooks/useAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Updated chart options:
const chartjs_options = {
  responsive: true,
  maintainAspectRatio: false, // <--- Disable the default aspect ratio
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Fabularius Admin Analytics",
    },
  },
};

const AnalyticsAdminPage: React.FC = () => {
  const [timewindow, setTimewindow] = useState<string>("1_hour");

  const { getAdminAnalytics } = useAPI();
  const { admin } = useAppSelector((state) => state.analytics);
  const dispatch = useAppDispatch();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user?.access_token) {
      dispatch(setAdminAnalytics(null));
      getAdminAnalytics(timewindow);
    }
  }, [auth.user?.access_token, timewindow]);

  const handleTimeWindowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimewindow(e.target.value);
    getAdminAnalytics(e.target.value);
  };

  if (!admin || Object.keys(admin).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-70px)] overflow-y-scroll no-scrollbar p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Analytics</h1>

      <div className="mb-4">
        <label htmlFor="timewindow" className="mr-2">
          Select Time Window:
        </label>
        <select
          id="timewindow"
          value={timewindow}
          onChange={handleTimeWindowChange}
          className="border rounded p-1 text-textPrimary"
        >
          <option value="1_hour">1 Hour</option>
          <option value="6_hours">6 Hours</option>
          <option value="24_hours">24 Hours</option>
          <option value="7_days">7 Days</option>
          <option value="30_days">30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Users Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Users Metrics</h2>
          <div className="h-96">
            {" "}
            {/* fixed height container */}
            <Line options={chartjs_options} data={admin["users"]} />
          </div>
        </div>

        {/* Content Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Content Overview</h2>
          <div className="h-96">
            <Line options={chartjs_options} data={admin["content_overview"]} />
          </div>
        </div>

        {/* Content by Type */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Content by Type</h2>
          <div className="h-96">
            <Line options={chartjs_options} data={admin["content_by_type"]} />
          </div>
        </div>

        {/* Per Active User */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Per Active User</h2>
          <div className="h-96">
            <Line options={chartjs_options} data={admin["per_active_user"]} />
          </div>
        </div>

        {/* Messages per Thread */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Messages per Thread</h2>
          <div className="h-96">
            <Line
              options={chartjs_options}
              data={admin["messages_per_thread"]}
            />
          </div>
        </div>

        {/* Activity Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Activity Metrics</h2>
          <div className="h-96">
            <Line options={chartjs_options} data={admin["activity"]} />
          </div>
        </div>

        {/* Retention */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Retention</h2>
          <div className="h-96">
            <Line options={chartjs_options} data={admin["retention"]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAdminPage;
