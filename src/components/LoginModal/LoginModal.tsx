import clsx from "clsx";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import { toggleLoginModal } from "../../store/features/app/appSlice";

const LoginModal: React.FC = () => {
  const { isLoginModalOpen } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        { hidden: !isLoginModalOpen },
        "bg-white dark:bg-darkMainSurfaceSecondary rounded-lg py-5 w-auto"
      )}
    >
      <div className="flex justify-between items-center pb-5 px-5 border-b border-borderBlack dark:border-darkBorderLight">
        <div className="text-lg font-semibold pr-[20px]">Login or signup</div>
        <div
          onClick={() => dispatch(toggleLoginModal())}
          className="h-[18px] w-[18px] cursor-pointer"
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex flex-row">
        {!auth?.isAuthenticated ? (
          <div className="flex flex-col w-[auto] items-center">
            <div className="max-w-[300px] px-[20px] mt-[20px]">
              {t(
                "Lola, it's nicer if you sign up. Your characters, games, and stories will be there at your next login!"
              )}
            </div>
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-buttonGreen text-white h-[50px] w-[220px] rounded-lg flex justify-center items-center mt-[40px]"
            >
              Login or signup
            </button>
          </div>
        ) : (
          <div className="mt-[20px] text-center w-full">Login successful</div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
