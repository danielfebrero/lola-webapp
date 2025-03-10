import { ImagesMultisize } from "./characters";

interface Message {
  id?: string;
  role: string;
  content: string;
  threadId?: string;
  created_at?: string;
  image_gen_on?: boolean;
  expected_image_count?: number;
  images?: ImagesMultisize[];
  request_id?: string;
  user_id?: string;
}

interface Thread {
  created_at?: string;
  threadId: string;
  chatLog?: Message[];
  type?: string;
  title?: string;
  isLoading?: boolean;
  isBeingDeleted?: boolean;
  isBeingArchived?: boolean;
  isInputAvailable?: boolean;
  canSendMessage?: boolean;
  state?: string;
  votes: number;
  isOwner: boolean;
  is_private?: boolean;
  lastRequestId?: string | null;
  isRequestStopped?: boolean;
  mode: str;
}
