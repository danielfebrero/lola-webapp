import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import Meta from "../../components/Meta";
import useAPI from "../../hooks/useAPI";
import { useAppSelector } from "../../store/hooks";
import RestoreIcon from "../../icons/restore";
import DeleteIcon from "../../icons/delete";
import { capitalizeFirstLetter } from "../../utils/string";
import useGA from "../../hooks/useGA";
import useWebSocket from "../../hooks/useWebSocket";
import { useAppDispatch } from "../../store/hooks";
import {
  removeArchivedThread,
  restoreArchivedThread,
  setCurrentlyViewing,
} from "../../store/features/app/appSlice";

const ArchivedPage: React.FC = () => {
  const { t } = useTranslation();
  const { getArchivedThreads, restoreThread } = useAPI();
  const auth = useAuth();
  const { archivedThreads } = useAppSelector((state) => state.app);
  const { sendEvent } = useGA();
  const { deleteCharacter, deleteHeroGame, deleteStory } = useWebSocket({});
  const dispatch = useAppDispatch();

  const restoreThreadHelper = (threadId: string) => {
    restoreThread(threadId);
    dispatch(restoreArchivedThread(threadId));
  };

  const deleteThread = (threadId: string, type: string) => {
    switch (type) {
      case "character":
        sendEvent("click_delete_char", "archived");
        deleteCharacter(threadId);
        break;

      case "you_are_the_hero":
        sendEvent("click_delete_game", "archived");
        deleteHeroGame(threadId);
        break;

      case "story":
        sendEvent("click_delete_story", "archived");
        deleteStory(threadId);
        break;

      default:
        console.warn("Unhandled type:", type);
    }

    dispatch(removeArchivedThread(threadId));
  };

  useEffect(() => {
    dispatch(setCurrentlyViewing({ objectType: null, objectId: null }));
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      getArchivedThreads();
    }
  }, [auth.isAuthenticated]);

  return (
    <>
      <Meta title={t("Archived")} />
      <div className="grow pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-90px)] items-center max-w-full">
          <div className="grow overflow-y-scroll no-scrollbar flex px-5 flex-col w-full items-center">
            {(!archivedThreads || archivedThreads.length === 0) && (
              <div className="text-center">{t("Nothing to show here yet")}</div>
            )}
            <table className="w-full max-w-[715px]">
              {archivedThreads?.map((thread) => (
                <tr>
                  <td className="py-[5px]">{thread.title}</td>
                  <td>{t(capitalizeFirstLetter(thread.type ?? ""))}</td>
                  <td>
                    <div
                      className="w-[18px] h-[18px] cursor-pointer"
                      onClick={() => restoreThreadHelper(thread.threadId)}
                    >
                      <RestoreIcon />
                    </div>
                  </td>
                  <td>
                    <div
                      className="w-[18px] h-[18px] cursor-pointer"
                      onClick={() =>
                        deleteThread(thread.threadId, thread.type ?? "")
                      }
                    >
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
