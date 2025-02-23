import ReactGA from "react-ga4";
import { GA_KEY } from "../utils/constants";
// import { useUserLog } from "@userlog/next";

ReactGA.initialize(GA_KEY);

export default function useGA() {
  // const { track } = useUserLog();

  const sendCustomEvent = (params: Record<string, any>) => {
    ReactGA.send(params);
  };

  const sendEvent = (eventName: string, channel?: string) => {
    ReactGA.event(`${channel}_${eventName}`);
    // track({
    //   channel: channel ?? "web",
    //   event: eventName,
    //   notify: true,
    // });
  };

  return {
    sendCustomEvent,
    sendEvent,
  };
}
