import clsx from "clsx";
import CheckOnlyIcon from "../../icons/checkOnly";

const PricingLayout: React.FC = () => {
  return (
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
                <span>Unlimited use</span>
              </div>
              <div
                className={clsx(
                  "px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] md:mt-auto text-center"
                )}
              >
                Your current plan
              </div>
            </div>
            <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
              <span className="text-xl font-bold">1-month Early Bird</span>
              <div className="text-4xl mt-[10px]">$5</div>
              <div className="flex flex-row items-center mt-[20px]">
                <div className="w-[18px] h-[18px]">
                  <CheckOnlyIcon />
                </div>
                <span>Unlimited use</span>
              </div>
              <div className="flex flex-row items-center mt-[5px]">
                <div className="w-[18px] h-[18px]">
                  <CheckOnlyIcon />
                </div>
                <span>Make your content private</span>
              </div>
              <div
                className={clsx(
                  "bg-lightGray dark:bg-darkLightGray cursor-pointer px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] md:mt-auto text-center flex flex-row justify-center"
                )}
              >
                Choose
              </div>
            </div>
            <div className="border border-borderColor dark:border-darkBorderColor rounded-lg flex p-[20px] flex-col">
              <span className="text-xl font-bold">Lifetime Early Bird</span>
              <div className="text-4xl mt-[10px]">$50</div>
              <div className="flex flex-row items-center mt-[20px]">
                <div className="w-[18px] h-[18px]">
                  <CheckOnlyIcon />
                </div>
                <span>Unlimited use</span>
              </div>
              <div className="flex flex-row items-center mt-[5px]">
                <div className="w-[18px] h-[18px]">
                  <CheckOnlyIcon />
                </div>
                <span>Make your content private</span>
              </div>
              <div className="flex flex-row items-center mt-[5px]">
                <div className="w-[18px] h-[18px]">
                  <CheckOnlyIcon />
                </div>
                <span>
                  Early Bird Trophy
                  <span className="text-xs">(soon)</span>
                </span>
              </div>
              <div
                className={clsx(
                  "bg-lightGray dark:bg-darkLightGray cursor-pointer px-[20px] py-[10px] rounded-full border border-borderColor dark:border-darkBorderColor mt-[20px] text-center flex flex-row justify-center"
                )}
              >
                Choose
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingLayout;
