import { useLayoutEffect, useRef } from "react";

function useClickOutside<T extends HTMLDivElement>(
  callback: () => void,
  exceptRef?: React.RefObject<HTMLDivElement> // Optional ref to exclude
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Check if the click is outside the main ref
      const isOutsideMain = ref.current && !ref.current.contains(target);
      // Check if the click is also outside the exceptRef (if provided)
      const isOutsideExcept = exceptRef?.current
        ? !exceptRef.current.contains(target)
        : true;

      // Trigger callback only if the click is outside both refs
      if (isOutsideMain && isOutsideExcept) {
        callback();
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount or dependency change
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, exceptRef]); // Add exceptRef as a dependency

  return ref;
}

export default useClickOutside;
