import clsx from "clsx";
import { useAppSelector } from "../../store/hooks";

interface OverlayProps {
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const { isSettingsOpen, isLoginModalOpen, isSmallScreen, isLeftPanelOpen } =
    useAppSelector((state) => state.app);

  return (
    <div
      className={clsx(
        {
          "w-0":
            !isSettingsOpen &&
            !isLoginModalOpen &&
            !(isSmallScreen && isLeftPanelOpen),
          "w-screen":
            isSettingsOpen ||
            isLoginModalOpen ||
            (isSmallScreen && isLeftPanelOpen),
          "left-[260px]": isSmallScreen && isLeftPanelOpen,
          "left-0": !(isSmallScreen && isLeftPanelOpen),
        },
        "absolute h-screen bg-transparentBlack z-50 flex justify-center items-center transition-left duration-500"
      )}
    >
      {props.children}
    </div>
  );
};

export default Overlay;
