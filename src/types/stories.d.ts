interface ImageSearch {
  entity: string;
  thumbnail: string;
  original: string;
}

interface Story {
  threadId: string;
  image_search_results: ImageSearch[];
  characters: string[];
  context: string;
  isImageSearchProcessing?: boolean;
}
