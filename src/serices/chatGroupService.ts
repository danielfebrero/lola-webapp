import { ChatGroup, SortOption } from "../types/chatGroup";

// Mock data for demo purposes
const mockChatGroups: ChatGroup[] = [
  {
    threadId: "1",
    title: "Kink Explorers",
    description: "Discuss your wildest fantasies and kinky interests",
    memberCount: 1254,
    messageCount: 5681,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    createdAt: "2024-12-01T10:30:00Z",
    tags: ["kink", "bdsm", "fetish"],
  },
  {
    threadId: "2",
    title: "Erotic Stories",
    description: "Share steamy tales and seductive narratives",
    memberCount: 876,
    messageCount: 3245,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    createdAt: "2025-01-15T08:20:00Z",
    imageUrl: "https://picsum.photos/id/134/120/120",
    tags: ["erotica", "stories", "fantasy"],
  },
  {
    threadId: "3",
    title: "Naughty Snaps",
    description: "Exchange spicy pics and get playful feedback",
    memberCount: 2356,
    messageCount: 7845,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    createdAt: "2024-11-10T14:45:00Z",
    tags: ["nsfw", "photos", "sexting"],
  },
  {
    threadId: "4",
    title: "Pleasure Seekers",
    description: "Share your hottest experiences and sexy tips",
    memberCount: 3254,
    messageCount: 9872,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    createdAt: "2025-02-05T16:30:00Z",
    imageUrl:
      "https://lola-ai-generated-images-dev.s3.amazonaws.com/images/41a811e6-1168-484e-ab09-4a5199a4b1b8.png",
    tags: ["sex", "pleasure", "hookups"],
  },
  {
    threadId: "5",
    title: "Tantric Secrets",
    description: "Explore sensual techniques and intimate connections",
    memberCount: 1876,
    messageCount: 6234,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdAt: "2025-01-22T12:15:00Z",
    imageUrl: "https://picsum.photos/id/140/120/120",
    tags: ["tantra", "sensual", "intimatemoments"],
  },
  {
    threadId: "6",
    title: "Seduction Squad",
    description: "Master the art of flirting and seduction",
    memberCount: 954,
    messageCount: 4120,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    createdAt: "2025-02-18T09:45:00Z",
    imageUrl: "https://picsum.photos/id/14/120/120",
    tags: ["flirting", "seduction", "nsfwchat"],
  },
];

export const chatGroupService = {
  getPublicChatGroups: async (
    search: string = "",
    sortBy: SortOption = "newest",
    limit: number = 20
  ): Promise<ChatGroup[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredGroups = [...mockChatGroups];

    // Apply search filter if provided
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredGroups = filteredGroups.filter(
        (group) =>
          group.title.toLowerCase().includes(searchLower) ||
          group.description.toLowerCase().includes(searchLower) ||
          group.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filteredGroups.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "active":
        filteredGroups.sort(
          (a, b) =>
            new Date(b.lastMessageDate).getTime() -
            new Date(a.lastMessageDate).getTime()
        );
        break;
      case "trending":
        filteredGroups.sort((a, b) => b.messageCount - a.messageCount);
        break;
      case "members":
        filteredGroups.sort((a, b) => b.memberCount - a.memberCount);
        break;
    }

    return filteredGroups.slice(0, limit);
  },
};
