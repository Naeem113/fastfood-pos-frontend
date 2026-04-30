import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";

interface FloorHallFormData {
  name: string;
  branchId: string;
}
export const floorHallFormModel = signal<FloorHallFormData>({
    name: '',
    branchId: ''
});

export function floorHallSchema(schema: SchemaPathTree<FloorHallFormData, PathKind.Root>) {
  required(schema.name, { message: 'Floor/Hall name is required' });
  required(schema.branchId, { message: 'Branch is required'})
}
