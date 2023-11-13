import Media from "./media";
export default interface Answer {
  ID: string;
  Content: string;
  IsCorrect: boolean;
  Media: Media | null;
}
