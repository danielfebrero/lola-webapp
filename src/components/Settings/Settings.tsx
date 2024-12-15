import clsx from "clsx";
import { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import CloseIcon from "../../icons/close";
import GuardIcon from "../../icons/guard";
import MembershipIcon from "../../icons/membership";
import PersonalizationIcon from "../../icons/personalization";
import { toggleSettings } from "../../store/features/app/appSlice";

const Settings: React.FC = () => {
  const isSettingsOpen = useAppSelector((state) => state.app.isSettingsOpen);
  const dispatch = useAppDispatch();
  const [selectedView, setSelectedView] = useState<
    "personalization" | "account" | "membership"
  >("personalization");

  return (
    <div
      className={clsx(
        { hidden: !isSettingsOpen },
        "bg-white rounded-lg py-5 w-[680px]"
      )}
    >
      <div className="flex justify-between items-center pb-5 px-5 border-b border-borderBlack">
        <div className="text-lg font-semibold">Settings</div>
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
              { "bg-lightGray": selectedView === "personalization" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("personalization")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <PersonalizationIcon />
            </div>
            <div>Personalization</div>
          </div>
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "account" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("account")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <GuardIcon />
            </div>
            <div>Account</div>
          </div>
          <div
            className={clsx(
              { "bg-lightGray": selectedView === "membership" },
              "rounded-lg flex flex-row items-center p-[10px] cursor-pointer"
            )}
            onClick={() => setSelectedView("membership")}
          >
            <div className="h-[16px] w-[16px] mr-2">
              <MembershipIcon />
            </div>
            <div>Membership</div>
          </div>
        </div>
        <div className="">
          {selectedView === "account" ? (
            <></>
          ) : selectedView === "membership" ? (
            <></>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
