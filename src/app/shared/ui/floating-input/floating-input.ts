import { Component, input, Input, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../common';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-floating-input',
  imports: [...COMMON_IMPORTS, FormField],
  templateUrl: './floating-input.html',
  styleUrls: ['./floating-input.scss'],
})
export class FloatingInput {
  @Input() size : 'sm' | 'md' | 'lg' = 'md';
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() type: string = 'text';

  // signal-based form field
  @Input() field!: any;

  // parent form submitted signal
  @Input() submitted = signal(false);
 isFocused = signal(false);
  hasError() {
    return (
      this.field().invalid?.() &&
      (this.field().touched?.() || this.submitted())
    );
  }

  // ✅ Input size classes
  get baseSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'px-3 pt-4 pb-1 text-sm rounded-md';
      case 'lg':
        return 'px-5 pt-7 pb-3 text-lg rounded-xl';
      default:
        return 'px-4 pt-6 pb-2 text-base rounded-xl';
    }
  }

  // ✅ Label size classes
  get labelSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return `
          top-1 text-xs left-3
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-sm
          peer-focus:top-1
          peer-focus:text-xs
        `;
      case 'lg':
        return `
          top-2 text-base left-5
          peer-placeholder-shown:top-5
          peer-placeholder-shown:text-lg
          peer-focus:top-2
          peer-focus:text-base
        `;
      default:
        return `
          top-1.5 text-sm left-4
          peer-placeholder-shown:top-4
          peer-placeholder-shown:text-base
          peer-focus:top-1.5
          peer-focus:text-sm
        `;
    }
  }
}
