import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";
import { useAppSelector } from "../../store/hooks";
import RestoreIcon from "../../icons/restore";
import DeleteIcon from "../../icons/delete";
import { capitalizeFirstLetter } from "../../utils/string";

const ArchivedPage: React.FC = () => {
  const { t } = useTranslation();
  const { getArchivedThreads } = useAPI();
  const auth = useAuth();
  const { archivedThreads } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (auth.isAuthenticated) {
      getArchivedThreads();
    }
  }, [auth.isAuthenticated]);

  return (
    <>
      <Meta title={t("Archived")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)] items-center max-w-full">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            <table className="w-full max-w-[715px]">
              {archivedThreads?.map((thread) => (
                <tr>
                  <td className="py-[5px]">{thread.title}</td>
                  <td>{t(capitalizeFirstLetter(thread.type ?? ""))}</td>
                  <td>
                    <div className="w-[18px] h-[18px] cursor-pointer">
                      <RestoreIcon />
                    </div>
                  </td>
                  <td>
                    <div className="w-[18px] h-[18px] cursor-pointer">
                      <DeleteIcon />
                    </div>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default ArchivedPage;
