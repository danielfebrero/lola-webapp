interface ImageSearch {
  entity: string;
  thumbnail: string;
  original: string;
}

interface Story {
  threadId: string;
  imagesSearch: ImageSearch[];
  characters: string[];
  context: string;
  isImageSearchProcessing?: boolean;
}
