import Media from "./media";
import Tag from "./tag";
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
  TagsName?: String;
  ListTags?: Array<Tag>;
  ExamQuestionArchiveID?: string;
}
