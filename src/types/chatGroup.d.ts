export interface ChatGroup {
  threadId: string;
  title: string;
  description: string;
  memberCount: number;
  messageCount: number;
  lastMessageDate: string;
  createdAt: string;
  imageUrl?: string;
  tags?: string[];
}

export type SortOption = "newest" | "active" | "trending" | "members";

export type PariticipationType =
  | "onlyMe"
  | "participants"
  | "custom"
  | "everyone";

export type CharactersPariticipationType = "automatically" | "onMention";
