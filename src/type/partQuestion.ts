import Media from "./media";
export default interface PartQuestion {
  ID: string;
  Description: string | null;
  Media: Media | null;
  Title: string;
  Type: string;
  TypePart: number;
  LevelPart: number;
  ParentID?: string;
  Questions: Array<any>;
  validateError?: boolean;
}
