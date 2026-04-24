import { AddressDto } from "./address.model";

export interface BranchDto {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  address?: AddressDto;
  phone?: string;
  isActive: boolean;
  createdBy: string;
  code:string;
  saleTaxReturnNumber:string;
  nationalTaxNumber:string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
