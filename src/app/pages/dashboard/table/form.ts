import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree, min } from "@angular/forms/signals";

interface TableFormData {
  name: string;
  tableNumber: number;
  capacity: number;
  section: string;
}
export const tableFormModel = signal<TableFormData>({
    name: '',
    tableNumber: 1,
    capacity: 2,
    section: ''
});

export function tableSchema(schema: SchemaPathTree<TableFormData, PathKind.Root>) {
  required(schema.name, { message: 'Table name is required' });
  required(schema.tableNumber, { message: 'Table number is required' });
}
