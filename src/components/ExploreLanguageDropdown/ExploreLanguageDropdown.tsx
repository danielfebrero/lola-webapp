import { useTranslation } from "react-i18next";

import CheckIcon from "../../icons/check";
import useClickOutside from "../../hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setExploreLanguage } from "../../store/features/app/appSlice";
import { ALL_LANGUAGES_BY_CODE_IN_ENGLISH } from "../../utils/constants";

interface ExploreLanguageDropdownProps {
  hide: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const languages = ALL_LANGUAGES_BY_CODE_IN_ENGLISH;

const ExploreLanguageDropdown: React.FC<ExploreLanguageDropdownProps> = (
  props
) => {
  const { exploreLanguage } = useAppSelector((state) => state.app);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const ref = useClickOutside(() => {
    props.hide();
  }, props.triggerRef);

  return (
    <div
      ref={ref}
      className="max-h-[calc(100%-100px)] overflow-y-scroll no-scrollbar rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[260px]"
    >
      {Object.keys(languages).map((ln) => (
        <div
          onClick={() => {
            dispatch(setExploreLanguage(ln));
            props.hide();
          }}
          className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center"
        >
          <div>
            <div>{t(languages[ln as "fr"])}</div>
          </div>
          {exploreLanguage === ln && (
            <div className="h-[20px] w-[20px]">
              <CheckIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExploreLanguageDropdown;
