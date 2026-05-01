import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";
import { AddressDto } from "../../../shared/models/address.model";
import { DiscountType } from "../../../shared/interfaces/discountType";

export interface CustomerFormData {
  code: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: Date | null;
  email: string;
  cnic: string;
  ntn: string;
  strn: string;
  discount: {
    enabled: boolean;
    value: number;
    type: DiscountType;
  }
  isActive: boolean;
  address: AddressDto;
  branchId: string;
  comments: string;
}
export const customerFormModel = signal<CustomerFormData>({
    code: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dob: null,
    email: '',
    cnic: '',
    ntn: '',
    strn: '',
    discount: {
      enabled: false,
      value: 0,
      type: DiscountType.Flat
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    },
    isActive: true,
    branchId: '',
    comments: '',
});

export function customerSchema(schema: SchemaPathTree<CustomerFormData, PathKind.Root>) {
  required(schema.firstName, { message: 'First name is required' });
  required(schema.branchId, {message: 'Branch is required'})
}
