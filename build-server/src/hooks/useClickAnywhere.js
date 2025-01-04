import { useEffect } from "react";
function useClickAnywhere(callback) {
    useEffect(() => {
        const handleClickAnywhere = (event) => {
            callback(event);
        };
        document.addEventListener("mousedown", handleClickAnywhere);
        return () => {
            document.removeEventListener("mousedown", handleClickAnywhere);
        };
    }, [callback]);
}
export default useClickAnywhere;
