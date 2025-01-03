import ReactGA from "react-ga4";

ReactGA.initialize("G-43V6GGK855");

export default function useGA() {
  const sendCustomEvent = (params: Record<string, any>) => {
    ReactGA.send(params);
  };
  return {
    sendCustomEvent,
    sendEvent: ReactGA.event,
  };
}
