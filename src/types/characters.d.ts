export interface Character {
  thread_id: string;
  name?: string;
  json?: Record<string, any>;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
  isImageProcessing?: boolean;
  isReportProcessing?: boolean;
  isImageUploading?: boolean;
  summary?: string;
  chatLog?: Message[];
  avatar?: ImagesMultisize;
}

interface ImagesMultisize {
  original: string;
  large: string;
  medium: string;
  small: string;
}

export interface CharacterServerData {
  data: Character;
  isOwner: boolean;
  threadId: string;
}
