import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLDivElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    typeof document !== "undefined" &&
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      typeof document !== "undefined" &&
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;
