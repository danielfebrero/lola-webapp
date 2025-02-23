import { useRef, ChangeEvent } from "react";
import clsx from "clsx";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void> | void; // Callback to handle file upload
  accept?: string; // File types to accept (e.g., "image/*")
  validTypes?: string[]; // Array of valid MIME types for validation
  className?: string; // Optional custom class for styling
  triggerButton?: React.ReactNode; // Optional custom trigger button
  disabled?: boolean; // Disable the input
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = "image/*",
  validTypes = ["image/gif", "image/png", "image/jpeg", "image/webp"],
  className,
  triggerButton,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validTypes && !validTypes.includes(file.type)) {
      console.error("Invalid file type. Please upload a supported format.");
      return;
    }

    try {
      await onUpload(file);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      // Reset the input to allow re-uploading the same file
      event.target.value = "";
    }
  };

  return (
    <div className={clsx("file-upload", className)}>
      {triggerButton ? (
        <div onClick={handleTriggerClick} className="cursor-pointer">
          {triggerButton}
        </div>
      ) : (
        <button
          onClick={handleTriggerClick}
          disabled={disabled}
          className={clsx(
            "rounded-lg cursor-pointer hover:bg-lightGray dark:hover:bg-darkMainSurcaceTertiary p-[10px]",
            { "opacity-50 cursor-not-allowed": disabled }
          )}
        >
          Upload File
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default FileUpload;
