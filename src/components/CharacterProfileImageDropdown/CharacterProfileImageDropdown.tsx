import { useRef } from "react";
import { useTranslation } from "react-i18next";

import useClickOutside from "../../hooks/useClickOutside";
import useAPI from "../../hooks/useAPI";

interface CharacterProfileImageDropdownProps {
  hide: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  threadId: string;
}

const CharacterProfileImageDropdown: React.FC<
  CharacterProfileImageDropdownProps
> = (props) => {
  const { t } = useTranslation();
  const ref = useClickOutside(() => {
    props.hide();
  }, props.triggerRef);

  const { uploadCharacterImage } = useAPI();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = () => {
    // Trigger the hidden file input click to open the file explorer
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Optional: Add validation for file type if needed (already restricted by accept attribute)
    const validImageTypes = [
      "image/gif",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      console.error("Invalid file type. Please upload an image.");
      return;
    }

    try {
      // Use the uploadCharacterImage function from useAPI hook
      await uploadCharacterImage(props.threadId, file);
      props.hide(); // Hide the dropdown after successful upload
    } catch (error) {
      console.error("Failed to upload image:", error);
    }

    // Reset the input value to allow uploading the same file again if needed
    event.target.value = "";
  };

  return (
    <div
      ref={ref}
      className="ml-[130px] rounded-lg border dark:border-darkBorderLight border-borderLight shadow pl-[5px] pr-[5px] pt-[5px] pb-[5px] w-fit absolute z-10 bg-white dark:bg-darkMainSurfaceSecondary min-w-[130px]"
    >
      <div
        onClick={uploadImage} // Simplified: just trigger uploadImage
        className="rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px] flex flex-row justify-between items-center"
      >
        {t("Upload image")}
      </div>

      {/* Hidden file input to open file explorer */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" // Accepts all image formats
        className="hidden"
      />
    </div>
  );
};

export default CharacterProfileImageDropdown;
