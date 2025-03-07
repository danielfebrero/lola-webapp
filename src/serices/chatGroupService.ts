import { ChatGroup, SortOption } from "../types/chatGroup";

// Mock data for demo purposes
const mockChatGroups: ChatGroup[] = [
  {
    id: "1",
    title: "AI Discussions",
    description: "Talk about the latest in AI and machine learning",
    memberCount: 1254,
    messageCount: 5681,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    createdAt: "2024-12-01T10:30:00Z",
    tags: ["tech", "ai", "learning"],
  },
  {
    id: "2",
    title: "Book Club",
    description: "Discuss your favorite books and discover new ones",
    memberCount: 876,
    messageCount: 3245,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    createdAt: "2025-01-15T08:20:00Z",
    imageUrl:
      "https://lola-ai-generated-images-dev.s3.amazonaws.com/images/41a811e6-1168-484e-ab09-4a5199a4b1b8.png",
    tags: ["reading", "books", "literature"],
  },
  {
    id: "3",
    title: "Photography Tips",
    description: "Share your photography tips and get feedback",
    memberCount: 2356,
    messageCount: 7845,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    createdAt: "2024-11-10T14:45:00Z",
    tags: ["photography", "creative", "tips"],
  },
  {
    id: "4",
    title: "Travel Adventures",
    description: "Share your travel experiences and find inspiration",
    memberCount: 3254,
    messageCount: 9872,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    createdAt: "2025-02-05T16:30:00Z",
    imageUrl:
      "https://lola-ai-generated-images-dev.s3.amazonaws.com/images/41a811e6-1168-484e-ab09-4a5199a4b1b8.png",
    tags: ["travel", "adventure", "global"],
  },
  {
    id: "5",
    title: "Cooking Masterclass",
    description: "Exchange recipes and cooking techniques",
    memberCount: 1876,
    messageCount: 6234,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdAt: "2025-01-22T12:15:00Z",
    imageUrl:
      "https://lola-ai-generated-images-dev.s3.amazonaws.com/images/41a811e6-1168-484e-ab09-4a5199a4b1b8.png",
    tags: ["cooking", "food", "recipes"],
  },
  {
    id: "6",
    title: "Fitness Goals",
    description: "Support each other in achieving fitness goals",
    memberCount: 954,
    messageCount: 4120,
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    createdAt: "2025-02-18T09:45:00Z",
    imageUrl:
      "https://lola-ai-generated-images-dev.s3.amazonaws.com/images/41a811e6-1168-484e-ab09-4a5199a4b1b8.png",
    tags: ["fitness", "health", "workout"],
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
