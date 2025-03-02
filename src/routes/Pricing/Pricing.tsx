import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAuth } from "react-oidc-context";

import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";
import LoadingIcon from "../../icons/loading";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setCurrentlyViewing,
  setIsCryptoCheckoutUrlLoading,
} from "../../store/features/app/appSlice";
import CheckOnlyIcon from "../../icons/checkOnly";
import useGA from "../../hooks/useGA";

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
  const { sendEvent } = useGA();

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

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: null, objectId: null }));
  }, []);

  return (
    <>
      <Meta title={t("Pricing")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex flex-col w-full items-center">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
                <span className="text-xl font-bold">Fabularius Free</span>
                <div className="text-4xl mt-[10px]">$0</div>
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
                  <span>{t('Unlimited "classic" images')}</span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t('10 "classic+" images per day')}</span>
                </div>
                {plan === "free" && (
                  <div
                    onClick={() => {
                      if (!auth?.isAuthenticated) {
                        auth.signinRedirect();
                        return;
                      }
                      sendEvent("choose_free", "pricing");
                    }}
                    className={clsx(
                      {
                        "cursor-pointer":
                          plan !== "free" || !auth?.isAuthenticated,
                      },
                      {
                        "bg-lightGray dark:bg-darkLightGray":
                          plan !== "free" || !auth?.isAuthenticated,
                      },
                      "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] md:mt-auto text-center"
                    )}
                  >
                    {t(
                      plan === "free" && auth?.isAuthenticated
                        ? "Your current plan"
                        : "Choose"
                    )}
                  </div>
                )}
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
                <span className="text-xl font-bold">{t("1-month")} Plus</span>
                <div className="text-4xl mt-[10px]">$10</div>
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
                    <div>{t("Uncensored")}</div>
                  </span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t('Unlimited "classic" images')}</span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t('Unlimited "classic+" images')}</span>
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
                      sendEvent("choose_early_1_month", "pricing");
                    }}
                    className={clsx(
                      { "cursor-pointer": plan !== "early_1_month" },
                      {
                        "bg-lightGray dark:bg-darkLightGray":
                          plan !== "early_1_month",
                      },
                      "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] md:mt-auto text-center flex flex-row justify-center"
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
                <span className="text-xl font-bold">{t("Lifetime Plus")}</span>
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
                    <div>{t("Uncensored")}</div>
                  </span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t('Unlimited "classic" images')}</span>
                </div>
                <div className="flex flex-row items-center mt-[5px]">
                  <div className="w-[18px] h-[18px]">
                    <CheckOnlyIcon />
                  </div>
                  <span>{t('Unlimited "classic+" images')}</span>
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
                    sendEvent("choose_early_lifetime", "pricing");
                  }}
                  className={clsx(
                    { "cursor-pointer": plan !== "early_lifetime" },
                    {
                      "bg-lightGray dark:bg-darkLightGray":
                        plan !== "early_lifetime",
                    },
                    "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] text-center flex flex-row justify-center"
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
            <div className="text-center w-full mt-[20px]">
              {t("Pay in crypto.")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
