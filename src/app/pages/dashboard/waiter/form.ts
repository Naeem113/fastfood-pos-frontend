import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";
import { AddressDto } from "../../../shared/models/address.model";

interface WaiterFormData {
  name: string;
  phone: string;
  address: AddressDto;
  isActive: boolean;
  branchId: string;
}
export const waiterFormModel = signal<WaiterFormData>({
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

export function waiterSchema(schema: SchemaPathTree<WaiterFormData, PathKind.Root>) {
  required(schema.name, { message: 'Table name is required' });
  required(schema.branchId, {message: 'Branch is required'})
}
