import clsx from "clsx";
import { useAppSelector } from "../../store/hooks";

interface OverlayProps {
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const { isSettingsOpen, isLoginModalOpen } = useAppSelector(
    (state) => state.app
  );

  return (
    <div
      className={clsx(
        { hidden: !isSettingsOpen && !isLoginModalOpen },
        "absolute h-screen w-screen bg-transparentBlack z-50 flex justify-center items-center"
      )}
    >
      {props.children}
    </div>
  );
};

export default Overlay;
