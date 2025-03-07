import clsx from "clsx";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onKeyDown,
  className,
  id,
  placeholder,
  required,
  disabled,
}) => {
  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        className,
        "px-3 py-2 border border-borderColor dark:border-darkBorderColor dark:bg-darkMainSurfacePrimary bg-white rounded-md focus:outline-none focus:ring-0"
      )}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      onKeyDown={onKeyDown}
    />
  );
};

export default TextInput;
