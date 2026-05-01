import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";
import { DiscountType } from "../../../shared/interfaces/discountType";

interface DiscountFormData {
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  description: string;
  fromDate: Date | null;
  toDate: Date | null;
  isActive: boolean;
  branchId: string;
}
export const discountFormModel = signal<DiscountFormData>({
    code: '',
    name: '',
    type: DiscountType.Percentage,
    value: 0,
    description: '',
    isActive: true,
    fromDate: null,
    toDate: null,
    branchId: ''
});

export function discountSchema(schema: SchemaPathTree<DiscountFormData, PathKind.Root>) {
  required(schema.name, { message: 'Discount name is required' });
  required(schema.value, { message: 'Discount Value is required' });
  required(schema.branchId, { message: 'Branch is required'})
}
