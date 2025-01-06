import { StaticImageData } from "next/image";

interface HeroAction {
  action_title: string;
  action_description: string;
}

interface Games {
  threadId: string;
  heroActions: HeroAction[];
  heroActionsIsLoading?: boolean;
}

interface Scenario {
  id: string;
  image: StaticImageData;
  label: string;
  adult: boolean;
  context: string;
}
