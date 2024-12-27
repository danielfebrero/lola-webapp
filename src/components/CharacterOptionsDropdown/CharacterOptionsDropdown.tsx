import useClickOutside from "../../hooks/useClickOutside";
import DeleteIcon from "../../icons/delete";
import useWebSocket from "../../hooks/useWebSocket";

interface CharacterOptionsDropdownProps {
  hide: () => void;
  threadId: string;
}

const CharacterOptionsDropdown: React.FC<CharacterOptionsDropdownProps> = (
  props
) => {
  const ref = useClickOutside(() => {
    props.hide();
  });
  const { deleteCharacter } = useWebSocket({});

  return (
    <div
      ref={ref}
      className="w-auto h-auto p-[10px] flex flex-col rounded-lg border border-borderColor absolute bg-white"
    >
      <div className="rounded-md w-full hover:bg-lightGray px-[15px] py-[10px] flex flex-row items-center cursor-pointer text-textError">
        <div className="h-[20px] w-[20px] mr-[10px]">
          <DeleteIcon />
        </div>
        <span onClick={() => deleteCharacter(props.threadId)}>Delete</span>
      </div>
    </div>
  );
};

export default CharacterOptionsDropdown;
