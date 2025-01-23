import { useTranslation } from "react-i18next";

import Meta from "../../components/Meta";

const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Meta title={t("Plans")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center">
          <div className="grow overflow-y-scroll no-scrollbar flex flex-col w-full items-center">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg items-center flex p-[10px] flex-col">
                <span className="text-xl font-bold">Lola Free</span>
                <div>$0</div>
                <div>Unlimited use</div>
                <div className="px-[20px] py-[10px] rounded-lg bg-lightGray dark:bg-darkMainSurcaceTertiary cursor-pointer">
                  {t("Your current plan")}
                </div>
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg items-center flex p-[10px] flex-col">
                <span className="text-xl font-bold">
                  Lola Early Bird for 1 month
                </span>
                <div>$5</div>
                <div>Unlimited use</div>
                <div>Keep your content private</div>
                <div className="px-[20px] py-[10px] rounded-lg bg-lightGray dark:bg-darkMainSurcaceTertiary cursor-pointer">
                  {t("Choose")}
                </div>
              </div>
              <div className="border border-borderColor dark:border-darkBorderColor rounded-lg items-center flex p-[10px] flex-col">
                <span className="text-xl font-bold">
                  Lola Early bird for Lifetime
                </span>
                <div>$200</div>
                <div>Unlimited use</div>
                <div>Keep your content private</div>
                <div>Lifetime Early Bird Trophee</div>
                <div className="px-[20px] py-[10px] rounded-lg bg-lightGray dark:bg-darkMainSurcaceTertiary cursor-pointer">
                  {t("Choose")}
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
