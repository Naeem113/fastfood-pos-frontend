import { signal } from "@angular/core";
import { PathKind, required, SchemaPathTree } from "@angular/forms/signals";

interface CategoryFormData {
  name: string;
  parentId: string;
  color: string;
}
export const categoryFormModel = signal<CategoryFormData>({
    name: '',
    parentId: '',
    color: '#6B7280'
});

export function categorySchema(schema: SchemaPathTree<CategoryFormData, PathKind.Root>) {
  required(schema.name, { message: 'Category name is required' });
}
