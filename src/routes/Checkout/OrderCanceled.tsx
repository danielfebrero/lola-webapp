import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useParams } from "react-router";

import Meta from "../../components/Meta";
import useWebSocket from "../../hooks/useWebSocket";

const OrderCanceledPage: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams<{ orderId: string }>();

  const { cancelCryptoOrder, socketConnection } = useWebSocket({});

  useEffect(() => {
    if (
      socketConnection?.readyState === socketConnection?.OPEN &&
      params.orderId
    ) {
      const orderId = params.orderId.split("&")[0];
      cancelCryptoOrder(orderId);
    }
  }, [socketConnection, params.orderId]);
  return (
    <>
      <Meta title={t("Order canceled")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center max-w-full">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            {t("Your order has been canceled.")}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderCanceledPage;
