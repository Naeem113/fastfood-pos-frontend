import { Component, Input, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../common';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-floating-select',
  imports: [...COMMON_IMPORTS, FormField],
  templateUrl: './floating-select.html',
  styleUrl: './floating-select.scss',
})
export class FloatingSelect {
   @Input() label!: string;
  @Input() required: boolean = false;
  @Input() field!: any;
  @Input() submitted = signal(false);

  @Input() options: { label: string; value: any }[] = [];

  // ✅ NEW
  @Input() multiple: boolean = false;

  isOpen = signal(false);

  hasError() {
    return (
      this.field?.invalid?.() &&
      (this.field?.touched?.() || this.submitted())
    );
  }

  hasValue() {
    const val = this.field?.value?.();
    return this.multiple ? val?.length > 0 : !!val;
  }

  toggleOption(value: any) {
    if (!this.multiple) return;

    let current = this.field.value() || [];

    if (current.includes(value)) {
      current = current.filter((v: any) => v !== value);
    } else {
      current = [...current, value];
    }

    this.field.setValue(current);
    this.field.markAsTouched();
  }

  isSelected(value: any) {
    const val = this.field?.value?.();
    return this.multiple ? val?.includes(value) : val === value;
  }

  displayValue() {
    const val = this.field?.value?.();

    if (this.multiple) {
      return this.options
        .filter(o => val?.includes(o.value))
        .map(o => o.label)
        .join(', ');
    }

    return this.options.find(o => o.value === val)?.label || '';
  }
}
