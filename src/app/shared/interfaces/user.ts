export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  id: string;
  companyId?: null;
  branchId?: null;
}
