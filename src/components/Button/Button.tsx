import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <div
      className={clsx(
        props.className,
        { "cursor-pointer": !props.disabled },
        "rounded-lg border border-borderColor dark:border-darkBorderColor px-[10px] py-[5px] cursor-pointer bg-mainSurfacePrimary dark:bg-darkMainSurfacePrimary hover:bg-lightGray dark:hover:bg-darkLightGray"
      )}
      onClick={props.disabled ? undefined : props.onClick}
    >
      {props.children}
    </div>
  );
};

export default Button;
