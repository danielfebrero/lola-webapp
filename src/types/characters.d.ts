export interface Character {
  thread_id: string;
  name?: string;
  json?: Record<string, any>;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
  isImageProcessing?: boolean;
  isReportProcessing?: boolean;
  summary?: string;
  chatLog?: Message[];
}

interface ImagesMultisize {
  original: string;
  large: string;
  medium: string;
  small: string;
}
