import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { AUTO_SCROLL_THRESHOLD } from "../utils/constants";

const useAutoScroll = (
  chatContainerRef: MutableRefObject<HTMLDivElement | null>
) => {
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Check if user is at the bottom within a threshold.
      if (scrollHeight - scrollTop - clientHeight <= AUTO_SCROLL_THRESHOLD) {
        setAutoScroll(true);
      } else {
        setAutoScroll(false);
      }
    }
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatContainerRef, handleScroll]);

  return { autoScroll };
};

export default useAutoScroll;
