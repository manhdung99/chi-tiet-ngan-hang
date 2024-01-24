import Media from "./media";
import PartQuestion from "./partQuestion";

export default interface AddNewArray {
  ID: string;
  Questions: Array<PartQuestion>;
  IsCorrect: boolean;
  Media: Media | null;
  Tags: Array<string>;
  Title: string;
  Type: string;
  TypePart: number;
  ExamQuestionArchiveID: string;
}
