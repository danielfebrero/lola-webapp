export interface Character {
  threadId: string;
  name?: string;
  json?: Record<string, any>;
  images?: string[];
  imagesMultisize?: ImagesMultisize[];
  isImageProcessing?: boolean;
  isReportProcessing?: boolean;
}

export interface ImagesMultisize {
  original: string;
  large: string;
  medium: string;
  small: string;
}
