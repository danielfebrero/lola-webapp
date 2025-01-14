import ReactGA from "react-ga4";
import { useUserLog } from "@userlog/react";

ReactGA.initialize("G-43V6GGK855");

export default function useGA() {
  const { track } = useUserLog();

  const sendCustomEvent = (params: Record<string, any>) => {
    ReactGA.send(params);
  };

  const sendEvent = (eventName: string, channel?: string) => {
    ReactGA.send(eventName);
    track({
      channel: channel ?? "web",
      event: eventName,
      notify: true,
    });
  };

  return {
    sendCustomEvent,
    sendEvent,
  };
}
