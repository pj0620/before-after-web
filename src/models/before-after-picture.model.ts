export interface BeforeAfterPicture {
  id: number;
  gender?: string;
  height?: number;
  age: number;
  startWeight: number;
  endWeight: number;
  weightChange: number;
  nsfw: boolean;
  createdAt: number;
  description: string;
  originalPost: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  comments: number;
  likes: number;
}
