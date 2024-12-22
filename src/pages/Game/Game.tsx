import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";

import Chat from "../../components/Chat";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentlyViewing } from "../../store/features/app/appSlice";

const lastGameId = "098DF098SDFQ08F-dani-tome-1";

const actions = [
  {
    action_title: "Invite Maya to a Private Lounge",
    action_description:
      "Leonardo discreetly invites Maya to a secluded lounge to test her intentions and introduce her to the inner circle, creating a sense of mystery and allure.",
    sex_level: 30,
    suited_for_main_character: 85,
  },
  {
    action_title: "Challenge Maya to a High-Stakes Game",
    action_description:
      "Leonardo suggests Maya join a high-stakes poker game where the bets go beyond money, as a way to gauge her nerves and intentions.",
    sex_level: 20,
    suited_for_main_character: 70,
  },
  {
    action_title: "Reveal the Party’s True Purpose",
    action_description:
      "Leonardo takes Maya to a hidden area of the mansion where the elite engage in exclusive activities, testing her reaction to decide if she can be trusted.",
    sex_level: 60,
    suited_for_main_character: 90,
  },
  {
    action_title: "Dance Floor Seduction",
    action_description:
      "Leonardo joins Maya on the dance floor, using his charm and subtle physical cues to gauge her comfort and intentions.",
    sex_level: 50,
    suited_for_main_character: 80,
  },
  {
    action_title: "Introduce Maya to Diddy",
    action_description:
      "Leonardo brings Maya into Diddy’s circle to see how she handles the intensity of their personalities and the subtle interrogations.",
    sex_level: 40,
    suited_for_main_character: 75,
  },
  {
    action_title: "Share a Personal Secret",
    action_description:
      "Leonardo confides a personal anecdote or secret to Maya, creating an intimate moment to disarm her and test her sincerity.",
    sex_level: 20,
    suited_for_main_character: 95,
  },
  {
    action_title: "Test Maya’s Resolve",
    action_description:
      "Leonardo invites Maya to participate in a seemingly innocent yet suggestive party game, pushing her boundaries subtly.",
    sex_level: 55,
    suited_for_main_character: 80,
  },
];

const GamePage: React.FC = () => {
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location.pathname === "/game") {
      lastGameId ? navigate("/game/" + lastGameId) : navigate("/game/new");
    }
  }, []);

  useEffect(() => {
    dispatch(
      setCurrentlyViewing({ objectType: "game", objectId: params.gameId })
    );
  }, [params.gameId]);

  return (
    <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
      <div className="grow border-r-2 border-borderColor w-1/2 pr-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="grow overflow-y-scroll">
          <Chat type="game" id={params.gameId} isChatLoading={isChatLoading} />
        </div>
      </div>
      <div className="grow w-1/2 pl-5 flex flex-col h-[calc(100vh-110px)]">
        <div className="overflow-y-scroll grid grid-cols-1">
          {actions.map((action) => (
            <div className="flex flex-col p-[20px] border-b border-borderColor hover:bg-lightGray cursor-pointer">
              <div className="font-semibold">{action.action_title}</div>
              <div className="">{action.action_description}</div>
              <div className="">
                Sex: {action.sex_level}% ; Character opinion:{" "}
                {action.suited_for_main_character}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
