import PartQuestion from "./partQuestion";

export default interface Lesson {
  ID: string;
  CourseID: string;
  ChapterID: string | null;
  partQuestion?: PartQuestion[] | null;
  OriginID?: string;
}
