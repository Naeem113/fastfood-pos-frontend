import { Role } from "../enums/role.enum";
import { AddressDto } from "./address.model";
import { BranchDto } from "./branch.model";

export interface CompanyDto {
  id:   string;
  name: string;
}

export interface UserDto {
  id:        string;
  companyId: string;
  branchId?: string;
  company?:  CompanyDto;
  branch?:   BranchDto;

  firstName: string;
  lastName?:  string;

  username: string;
  email?:   string;
  phone?:   string;
  address?: AddressDto;

  password: string;
  role:     Role;

  isActive:   boolean;
  lastLogin?: string;

  refreshToken?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
}
