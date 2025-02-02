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
  created_at: date;
  scenario: string;
  title: string;
  mode: string;
  images_multisize: ImagesMultisize;
  scenario_locales: Record<string, string>;
  title_locales: Record<string, string>;
}
