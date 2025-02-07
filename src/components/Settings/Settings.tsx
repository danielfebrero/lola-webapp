import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import PersonalizationIcon from "../../icons/personalization";
import { toggleSettings } from "../../store/features/app/appSlice";
import useWebSocket from "../../hooks/useWebSocket";
import { setSettings as setSettingsAction } from "../../store/features/user/userSlice";

const Settings: React.FC = () => {
  const { isSettingsOpen, languages } = useAppSelector((state) => state.app);
  const { settings } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [selectedView, setSelectedView] = useState<
    "personalization" | "account" | "membership"
  >("personalization");
  const { t } = useTranslation();
  const { setSettings } = useWebSocket({});

  if (!isSettingsOpen) {
    return null;
  }

  console.log({ languages });

  return (
    <div
      className={clsx(
        "bg-white dark:bg-darkMainSurfaceSecondary rounded-lg py-5 md:w-[680px] w-[80%]"
      )}
    >
      <div className="flex justify-between items-center pb-5 px-5 border-b border-borderBlack">
        <div className="text-lg font-semibold">{t("Settings")}</div>
        <div
          onClick={() => dispatch(toggleSettings())}
          className="h-[18px] w-[18px] cursor-pointer"
        >
          <CloseIcon />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="md:block hidden flex flex-col p-[10px]">
          <div
            className={clsx(
              {
                "bg-lightGray dark:bg-darkLightGray":
                  selectedView === "personalization",
              },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer min-w-[260px]"
            )}
            onClick={() => setSelectedView("personalization")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <PersonalizationIcon />
            </div>
            <div>{t("Personalization")}</div>
          </div>
        </div>
        <div className="p-[20px] w-full">
          {selectedView === "personalization" ? (
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between w-full">
                <span>{t("Language")}</span>
                <div>
                  <select
                    className="bg-white dark:bg-darkMainSurfaceSecondary"
                    onChange={(e) => {
                      setSettings({ language: e.target.value });
                      dispatch(setSettingsAction({ language: e.target.value }));
                    }}
                  >
                    <option value="auto">{t("Auto-detect")}</option>
                    {Object.keys(languages).map((l) => (
                      <option value={l} selected={l === settings.language}>
                        {languages[l]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Settings;
