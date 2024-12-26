interface Character {
  threadId: string;
  name?: string;
  json?: Record<string, any>;
  images?: string[];
  isImageProcessing?: boolean;
  isReportProcessing?: boolean;
}
