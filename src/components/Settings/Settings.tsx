import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import PersonalizationIcon from "../../icons/personalization";
import { toggleSettings } from "../../store/features/app/appSlice";

const Settings: React.FC = () => {
  const { isSettingsOpen, languages } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const [selectedView, setSelectedView] = useState<
    "personalization" | "account" | "membership"
  >("personalization");
  const { t, i18n } = useTranslation();

  if (!isSettingsOpen) {
    return null;
  }

  return (
    <div
      className={clsx(
        "bg-white dark:bg-darkMainSurfaceSecondary rounded-lg py-5 w-[680px]"
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
        <div className="flex flex-col p-[10px]">
          <div
            className={clsx(
              {
                "bg-lightGray dark:bg-darkLightGray":
                  selectedView === "personalization",
              },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
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
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                  >
                    <option value="auto">{t("Auto-detect")}</option>
                    {Object.keys(languages).map((l) => (
                      <option value={l} selected={l === i18n.language}>
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
