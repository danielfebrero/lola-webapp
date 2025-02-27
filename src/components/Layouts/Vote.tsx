import clsx from "clsx";
import DownvoteIcon from "../../icons/downvote";
import UpvoteIcon from "../../icons/upvote";

interface VoteLayoutProps {
  votes: number;
}

const VoteLayout: React.FC<VoteLayoutProps> = (props) => {
  return (
    <div className="flex flex-row rounded-full dark:bg-darkMainSurcaceTertiary bg-gray-200 items-center">
      <div
        className={clsx(
          "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
        )}
      >
        <UpvoteIcon />
      </div>
      <span className="mx-[5px]">{props.votes ?? 0}</span>
      <div
        className={clsx(
          "cursor-pointer w-[30px] h-[30px] hover:dark:bg-darkMainSurfacePrimary hover:bg-white p-[5px] rounded-full"
        )}
      >
        <DownvoteIcon />
      </div>
    </div>
  );
};

export default VoteLayout;
