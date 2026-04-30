import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";

interface KitchenFormData {
  name: string;
  color: string;
  branchId: string;
}
export const kitchenFormModel = signal<KitchenFormData>({
    name: '',
    color: '#6B7280',
    branchId: ''
});

export function kitchenSchema(schema: SchemaPathTree<KitchenFormData, PathKind.Root>) {
  required(schema.name, { message: 'Kitchen name is required' });
  required(schema.branchId, { message: 'Branch is required'})
}
