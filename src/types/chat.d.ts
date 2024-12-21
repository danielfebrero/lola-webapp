interface Message {
  role: string;
  content: string;
}

interface ChatLog {
  created_at?: string;
  threadId: string;
  chatLog?: Message[];
  type?: string;
  title?: string;
}
