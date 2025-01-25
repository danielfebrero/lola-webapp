import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAuth } from "react-oidc-context";

import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import LoadingIcon from "../../icons/loading";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setIsCryptoCheckoutUrlLoading } from "../../store/features/app/appSlice";
import CheckOnlyIcon from "../../icons/checkOnly";

const PricingPage: React.FC = () => {
  const [hasClickedLifetime, setHasClickedLifettime] = useState<boolean>(false);
  const [hasClicked1month, setHasClicked1month] = useState<boolean>(false);
  const { t } = useTranslation();
  const { getCryptoCheckoutUrl, getUserPlan } = useWebSocket({});
  const dispatch = useAppDispatch();
  const auth = useAuth();
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

  useEffect(() => {
    const inter = setInterval(() => {
      getUserPlan();
    }, 5000);

    return () => clearInterval(inter);
  }, []);

  return (
    <>
      <Meta title={t("Pricing")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex flex-col w-full items-center">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
                <span className="text-xl font-bold">Lola Free</span>
                <div className="text-4xl mt-[10px]">$0</div>
                <div className="flex flex-row items-center mt-[20px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t("Unlimited use")}</span>
                </div>
                {plan === "free" && (
                  <div
                    className={clsx(
                      { "cursor-pointer": plan !== "free" },
                      {
                        "bg-lightGray dark:bg-darkLightGray": plan !== "free",
                      },
                      "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-auto text-center"
                    )}
                  >
                    {t(plan === "free" ? "Your current plan" : "Choose")}
                  </div>
                )}
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
                <span className="text-xl font-bold">
                  {t("1-month")} Early Bird
                </span>
                <div className="text-4xl mt-[10px]">$5</div>
                <div className="flex flex-row items-center mt-[20px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t("Unlimited use")}</span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t("Make your content private")}</span>
                </div>
                {plan !== "early_lifetime" && (
                  <div
                    onClick={() => {
                      if (
                        hasClickedLifetime ||
                        hasClicked1month ||
                        plan === "early_1_month"
                      )
                        return;

                      if (!auth?.isAuthenticated) {
                        auth.signinRedirect();
                        return;
                      }
                      getCryptoCheckoutUrl("early_1_month");
                      setHasClicked1month(true);
                      dispatch(setIsCryptoCheckoutUrlLoading(true));
                    }}
                    className={clsx(
                      { "cursor-pointer": plan !== "early_1_month" },
                      {
                        "bg-lightGray dark:bg-darkLightGray":
                          plan !== "early_1_month",
                      },
                      "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-auto text-center"
                    )}
                  >
                    {hasClicked1month ? (
                      <div className="w-[24px] h-[24px] text-textPrimary dark:text-darkTextPrimary">
                        <LoadingIcon />
                      </div>
                    ) : (
                      t(
                        plan === "early_1_month"
                          ? "Your current plan"
                          : "Choose"
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
                <span className="text-xl font-bold">
                  {t("Lifetime Early Bird")}
                </span>
                <div className="text-4xl mt-[10px]">$50</div>
                <div className="flex flex-row items-center mt-[20px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t("Unlimited use")}</span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t("Make your content private")}</span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>
                    Early Bird Trophy{" "}
                    <span className="text-xs">({t("soon")})</span>
                  </span>
                </div>
                <div
                  onClick={() => {
                    if (
                      hasClickedLifetime ||
                      hasClicked1month ||
                      plan === "early_lifetime"
                    )
                      return;

                    if (!auth?.isAuthenticated) {
                      auth.signinRedirect();
                      return;
                    }
                    getCryptoCheckoutUrl("early_lifetime");
                    setHasClickedLifettime(true);
                    dispatch(setIsCryptoCheckoutUrlLoading(true));
                  }}
                  className={clsx(
                    { "cursor-pointer": plan !== "early_lifetime" },
                    {
                      "bg-lightGray dark:bg-darkLightGray":
                        plan !== "early_lifetime",
                    },
                    "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] text-center"
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
