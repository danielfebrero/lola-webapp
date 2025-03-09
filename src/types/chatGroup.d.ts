import { ImagesMultisize } from "./characters";

export interface ChatGroup {
  threadId: string;
  title: string;
  description?: string;
  memberCount: number;
  messageCount: number;
  lastMessageDate?: string;
  createdAt: string;
  imagesMultisize?: ImagesMultisize;
  tags?: string[];
  participation: PariticipationType;
  charactersParticipation: CharactersPariticipationType;
  characters: string[];
  isPublic: boolean;
  isArchived: boolean;
  isDeleted: boolean;
}

export type SortOption = "newest" | "active" | "trending" | "members";

export type PariticipationType = "onlyMe" | "custom" | "participants";

export type CharactersPariticipationType = "automatically" | "onMention";
