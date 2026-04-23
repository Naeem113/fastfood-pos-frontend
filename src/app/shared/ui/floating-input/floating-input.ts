import { Component, input, Input, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../common';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-floating-input',
  imports: [...COMMON_IMPORTS, FormField],
  templateUrl: './floating-input.html',
  styleUrl: './floating-input.scss',
})
export class FloatingInput {
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
}
