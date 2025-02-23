import { useTranslation } from "react-i18next";
import useClickOutside from "../../hooks/useClickOutside";
import useAPI from "../../hooks/useAPI";
import FileUpload from "../FileUpload";

interface CharacterProfileImageDropdownProps {
  hide: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  threadId: string;
}

const CharacterProfileImageDropdown: React.FC<
  CharacterProfileImageDropdownProps
> = (props) => {
  const { t } = useTranslation();
  const ref = useClickOutside(() => props.hide(), props.triggerRef);
  const { uploadCharacterImage } = useAPI();

  const handleUpload = async (file: File) => {
    await uploadCharacterImage(props.threadId, file);
    props.hide();
  };

  return (
    <div
      ref={ref}
      className="ml-[130px] rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[130px]"
    >
      <FileUpload
        onUpload={handleUpload}
        triggerButton={
          <div className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center">
            {t("Upload image")}
          </div>
        }
      />
    </div>
  );
};

export default CharacterProfileImageDropdown;
