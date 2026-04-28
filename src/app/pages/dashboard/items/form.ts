import { signal, computed } from '@angular/core';
import { applyEach, applyWhen, PathKind, required, schema, SchemaPathTree } from '@angular/forms/signals';

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
  coverColor?: string;
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
  coverColor: '#6B7280',
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

type ItemSchema = SchemaPathTree<ItemFormData, PathKind.Root>;

export function itemSchema(s: ItemSchema) {
  // basic
  required(s.name, { message: 'Item name is required' });
  required(s.unit, { message: 'Unit is required' });
  required(s.categoryId, { message: 'Category is required' });
  required(s.type, { message: 'Type is required' });

  // ✅ SINGLE MODE
  applyWhen(
    s, // ✅ use ROOT, not s.type
    ({ valueOf }) => valueOf(s.type) === 'single',
    (schema) => {
      required(schema.price, { message: 'Price is required' });
    }
  );

  // ✅ VARIANT MODE
  applyWhen(
    s, // ✅ use ROOT
    ({ valueOf }) => valueOf(s.type) === 'variant',
    (schema) => {
      required(schema.variants, {
        message: 'At least one variant is required'
      });

      applyEach(schema.variants, (variant) => {
        required(variant.name, {
          message: `Variant name required`
        });

        required(variant.price, {
          message: `Variant price required`
        });
      });
    }
  );
}

