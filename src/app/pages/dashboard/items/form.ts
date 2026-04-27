import { signal, computed } from '@angular/core';
import { PathKind, required, SchemaPathTree } from '@angular/forms/signals';

export type ItemType = 'single' | 'variant';

export interface Variant {
  name: string;
  price: number;
  retailMargin?: number;
  costPrice?: number;
}

export interface ItemFormData {
  name: string;
  description: string;
  unit: string;
  type: ItemType;
  variants: Variant[];

  categoryId: string;
  price: number;
  costPrice: number;
  retailMargin: number;

  sku: string;
  barcode: string;

  allowedBranches: string[];

  enableStock: boolean;
  initialStock: number;
  stockAlertThreshold: number;

  isSellable: boolean;
  isAvailable: boolean;
  isActive: boolean;
}

// 🔥 MAIN SIGNAL
export const itemFormModel  = signal<ItemFormData>({
  name: '',
  description: '',
  unit: '',
  type: 'single',

  variants: [],

  categoryId: '',
  price: 0,
  costPrice: 0,
  retailMargin: 0,

  sku: '',
  barcode: '',

  allowedBranches: [],

  enableStock: false,
  initialStock: 0,
  stockAlertThreshold: 0,

  isSellable: false,
  isAvailable: false,
  isActive: true
});

export function itemSchema(
  schema: SchemaPathTree<ItemFormData, PathKind.Root>,
  form: ItemFormData
) {
  // ── BASIC FIELDS ─────────────────────────────
  required(schema.name, { message: 'Item name is required' });
  required(schema.unit, { message: 'Unit is required' });
  required(schema.categoryId, { message: 'Category is required' });
  required(schema.type, { message: 'Type is required' });

  // ── SINGLE MODE ───────────────────────────────
  if (form.type === 'single') {
    required(schema.price, { message: 'Price required' });
  }

  // ── VARIANT MODE ──────────────────────────────
  if (form.type === 'variant') {

    // ✅ runtime check (NOT schema)
    if (form.variants.length === 0) {
      // ❗ correct way: attach error on root field, not schema.variants.error
      required(schema.variants, {
        message: 'At least one variant is required'
      });
    }

    // ✅ iterate runtime data
    form.variants.forEach((_, i) => {

      const variantSchema = schema.variants.at(i);

      if (!variantSchema) return;

      required(variantSchema.name, {
        message: `Variant ${i + 1} name required`
      });

      required(variantSchema.price, {
        message: `Variant ${i + 1} price required`
      });
    });
  }
}
