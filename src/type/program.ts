export default interface Program {
  OriginID: string | null;
  Name: string;
  Code: string | null;
  ParentID: string | null;
  CreateUser: string | null;
  Created: string;
  Updated: string;
  IsAdmin: boolean;
  IsActive: boolean;
  MainSubjectID: string;
  Order: number;
  EducationLevels: Array<number>;
  ID: string;
}
