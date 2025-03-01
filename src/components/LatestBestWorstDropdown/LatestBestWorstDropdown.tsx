import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";
import { capitalizeFirstLetter } from "../../utils/string";

interface LatestBestWorstDropdownProps {
  hide: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const exploreModes = ["latest", "best"];

const LatestBestWorstDropdown: React.FC<LatestBestWorstDropdownProps> = (
  props
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  const ref = useClickOutside(() => {
    props.hide();
  }, props.triggerRef);

  return (
    <div
      ref={ref}
      className="max-h-[calc(100%-100px)] overflow-y-scroll no-scrollbar rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[260px]"
    >
      {exploreModes.map((em) => (
        <div
          onClick={() => {
            navigate(`/explore/${params.type}/${em}`);
            props.hide();
          }}
          className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center"
        >
          <div>
            <div>{t(capitalizeFirstLetter(em))}</div>
          </div>
          {params.exploreMode === em && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LatestBestWorstDropdown;
