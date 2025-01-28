import ChevronDown from "../../icons/chevronDown";
import PanelIcon from "../../icons/panel";
import NewChatIcon from "../../icons/newChat";

interface HeaderLayoutProps {
  dropdownLabel: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ dropdownLabel }) => {
  return (
    <div className="pl-[20px] pr-[20px] pt-[10px] flex flex-row justify-between items-center">
      <div className="w-auto h-auto">
        <div className="flex flex-row items-center">
          <div className="h-[40px] items-center flex flex-row text-textSecondary dark:text-darkTextSecondary cursor-pointer">
            <div className="flex flex-row text-textSecondary dark:text-darkTextSecondary">
              <div className="h-[24px] w-[24px] cursor-pointer mr-[10px]">
                <PanelIcon />
              </div>
              <div className="h-[24px] w-[24px]  mr-[10px]">
                <NewChatIcon />
              </div>
            </div>
            <span className="font-bold">{dropdownLabel}</span>
            <div className="h-[24px] w-[24px]">
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="bg-sky-700 rounded-full h-[34px] w-[34px] text-white text-center content-center cursor-pointer"></div>
      </div>
    </div>
  );
};

export default HeaderLayout;
