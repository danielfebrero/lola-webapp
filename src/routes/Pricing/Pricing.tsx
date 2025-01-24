import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import clsx from "clsx";

import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import LoadingIcon from "../../icons/loading";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setIsCryptoCheckoutUrlLoading } from "../../store/features/app/appSlice";

const PricingPage: React.FC = () => {
  const [hasClickedLifetime, setHasClickedLifettime] = useState<boolean>(false);
  const [hasClicked1month, setHasClicked1month] = useState<boolean>(false);
  const { t } = useTranslation();
  const { getCryptoCheckoutUrl } = useWebSocket({});
  const dispatch = useAppDispatch();
  const { isCryptoPricingCheckoutUrlLoading } = useAppSelector(
    (state) => state.app
  );
  const { plan } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isCryptoPricingCheckoutUrlLoading === false) {
      setHasClicked1month(false);
      setHasClickedLifettime(false);
    }
  }, [isCryptoPricingCheckoutUrlLoading]);
  return (
    <>
      <Meta title={t("Pricing")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex flex-col w-full items-center">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg items-center flex p-[10px] flex-col">
                <span className="text-xl font-bold">Lola Free</span>
                <div>$0</div>
                <div>Unlimited use</div>
                <div
                  className={clsx(
                    { "cursor-pointer": plan !== "free" },
                    "px-[20px] py-[10px] rounded-lg bg-lightGray dark:bg-darkMainSurcaceTertiary"
                  )}
                >
                  {t(plan === "free" ? "Your current plan" : "Choose")}
                </div>
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg items-center flex p-[10px] flex-col">
                <span className="text-xl font-bold">
                  Lola Early Bird for 1 month
                </span>
                <div>$5</div>
                <div>Unlimited use</div>
                <div>Keep your content private</div>
                <div
                  onClick={() => {
                    if (hasClickedLifetime || hasClicked1month) return;
                    getCryptoCheckoutUrl("early_1_month");
                    setHasClicked1month(true);
                    dispatch(setIsCryptoCheckoutUrlLoading(true));
                  }}
                  className={clsx(
                    { "cursor-pointer": plan !== "early_1_month" },
                    "px-[20px] py-[10px] rounded-lg bg-lightGray dark:bg-darkMainSurcaceTertiary"
                  )}
                >
                  {hasClicked1month ? (
                    <div className="w-[24px] h-[24px] text-textPrimary dark:text-darkTextPrimary">
                      <LoadingIcon />
                    </div>
                  ) : (
                    t(plan === "early_1_month" ? "Your current plan" : "Choose")
                  )}
                </div>
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg items-center flex p-[10px] flex-col">
                <span className="text-xl font-bold">
                  Lola Early Bird for Lifetime
                </span>
                <div>$200</div>
                <div>Unlimited use</div>
                <div>Keep your content private</div>
                <div>Lifetime Early Bird Trophee</div>
                <div
                  onClick={() => {
                    if (hasClickedLifetime || hasClicked1month) return;
                    getCryptoCheckoutUrl("early_lifetime");
                    setHasClickedLifettime(true);
                    dispatch(setIsCryptoCheckoutUrlLoading(true));
                  }}
                  className={clsx(
                    { "cursor-pointer": plan !== "early_lifetime" },
                    "px-[20px] py-[10px] rounded-lg bg-lightGray dark:bg-darkMainSurcaceTertiary"
                  )}
                >
                  {hasClickedLifetime ? (
                    <div className="w-[24px] h-[24px] text-textPrimary dark:text-darkTextPrimary">
                      <LoadingIcon />
                    </div>
                  ) : (
                    t(
                      plan === "early_lifetime" ? "Your current plan" : "Choose"
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
