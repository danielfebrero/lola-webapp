export interface HeroActions {
  action_title: string;
  action_description: string;
}

export interface Games {
  threadId: string;
  heroActions: HeroActions[];
  heroActionsIsLoading?: boolean;
}
