import { useEffect } from "react";

function useClickAnywhere(callback: (event: MouseEvent) => void): void {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      callback(event);
    };

    typeof document !== "undefined" &&
      document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      typeof document !== "undefined" &&
        document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [callback]);
}

export default useClickAnywhere;
