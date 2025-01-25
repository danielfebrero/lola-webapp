import { useTranslation } from "react-i18next";

import Meta from "../../components/Meta";

const OrderReceivedPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t("Order received")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center max-w-full">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            {t("Your order is being processed. This may takes a few minutes.")}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderReceivedPage;
