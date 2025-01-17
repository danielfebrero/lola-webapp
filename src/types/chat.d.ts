interface Message {
  id?: string;
  role: string;
  content: string;
  threadId?: string;
  timestamp?: string;
}

interface ChatLog {
  created_at?: string;
  threadId: string;
  chatLog?: Message[];
  type?: string;
  title?: string;
  isLoading?: boolean;
  isBeingDeleted?: boolean;
  isInputAvailable?: boolean;
  canSendMessage?: boolean;
  state?: string;
  upvotes: number;
  downvotes: number;
}
