import Lesson from "./lesson";
export default interface Unit {
  ID: string;
  Name: string;
  TotalLessons: number;
  Lessons: Array<Lesson> | null;
}
