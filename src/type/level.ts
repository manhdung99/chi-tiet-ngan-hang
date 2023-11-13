export default interface Level {
  OriginID: string | null;
  Name: string;
  Code: string | null;
  ParentID: string | null;
  CreateUser: string | null;
  Created: string;
  Updated: string;
  IsAdmin: boolean;
  IsActive: boolean;
  SubjectID: string;
  Order: number;
  ID: string;
}
