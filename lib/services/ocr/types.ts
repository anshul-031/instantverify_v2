import { ExtractedInfo } from '@/lib/types/deepvue';

export interface OcrData {
  id: string;
  data: ExtractedInfo;
  createdAt: Date;
}