interface HeroActions {
  action_title: string;
  action_description: string;
}

interface Games {
  threadId: string;
  heroActions: HeroActions[];
  heroActionsIsLoading?: boolean;
}
