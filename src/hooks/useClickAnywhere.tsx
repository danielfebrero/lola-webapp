import { useEffect } from "react";

function useClickAnywhere(callback: (event: MouseEvent) => void): void {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      callback(event);
    };

    document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [callback]);
}

export default useClickAnywhere;
