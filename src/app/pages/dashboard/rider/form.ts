import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";
import { AddressDto } from "../../../shared/models/address.model";

interface RiderFormData {
  name: string;
  phone: string;
  address: AddressDto;
  isActive: boolean;
  branchId: string;
}
export const riderFormModel = signal<RiderFormData>({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    },
    isActive: true,
    branchId: ''
});

export function riderSchema(schema: SchemaPathTree<RiderFormData, PathKind.Root>) {
  required(schema.name, { message: 'Rider name is required' });
  required(schema.phone, { message: 'Rider phone is required' });
  required(schema.branchId, {message: 'Branch is required'})
}
