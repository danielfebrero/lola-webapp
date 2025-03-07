export interface ChatGroup {
  id: string;
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
