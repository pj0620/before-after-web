export interface BeforeAfterPicture {
  id: number;
  gender?: string;
  age: number;
  startWeight: number;
  endWeight: number;
  weightChange: number;
  nsfw: boolean;
  createdAt: number;
  description: string;
  originalPost: string;
  imageUrl: string;
}
