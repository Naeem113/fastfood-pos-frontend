import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  TemplateRef,
  forwardRef,
  inject
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
// import { TranslateService } from '../../services/translate.service';
import { COMMON_IMPORTS } from '../../common';
import { PRIME_NG_IMPORTS } from '..';

@Component({
  selector: 'app-select-field',
  imports: [...COMMON_IMPORTS, PRIME_NG_IMPORTS],
  templateUrl: './select-field.html',
  styleUrls: ['./select-field.scss'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => SelectFieldComponent),
  //     multi: true
  //   }
  // ]
})

export class SelectField implements ControlValueAccessor {

  @Input() options: any[] = [];
  @Input() optionLabel: string = '';
  @Input() optionValue: string = '';
  @Input() optionDisabled: string = '';
  @Input() objectId: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() prefixIcon: string = '';
  @Input() id:string='';
  @Input() isRequired: boolean = false;
  @Input() loading: boolean = false;
  @Input() showClear: boolean = false;
  @Input() showFilter: boolean = false;
  @Input() showAddOptionButton: boolean = false;
  @Input() isSubmitted: boolean = false;
  @Input() errorMessage?: string;
  @Output() addOption:EventEmitter<void> = new EventEmitter<void>();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChild('itemTemplate') itemTemplate!: TemplateRef<any>;
  @ContentChild('selectedTemplate') selectedTemplate!: TemplateRef<any>;
  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  @ContentChild('footerTemplate') footerTemplate!: TemplateRef<any>;

  // translateService = inject(TranslateService);
  value: any = null;
  isDisabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this; // ✅ Connect control to custom accessor
    }
  }

  writeValue(value: any): void {
    if (this.objectId && value != null) {
      // Find matching object using objectId
      const selected = this.options.find(
        (opt) => opt[this.objectId] === value
      );
      this.value = selected ?? null;
    } else {
      this.value = value;
    }
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleChange(event: any) {
    const selectedObject = event.value;

    // Emit full object
    this.selectionChange.emit(selectedObject);

    if (this.objectId) {
      // Store only objectId in form control
      this.onChange(selectedObject?.[this.objectId] ?? null);
    } else {
      this.onChange(selectedObject);
    }
  }

  get control() { return this.ngControl?.control; }

  get invalid(): boolean {
    const angularInvalid = !!this.control && this.control.invalid && (this.control.touched || this.control.dirty);
    return this.isSubmitted && (angularInvalid || !!this.errorMessage);
  }

  get errors(): any {
    return this.control?.errors ?? null;
  }

  get autoErrorMessage(): string | null {
    if (!this.errors) return null;

    // if (this.errors['required']) return this.translateService.translate(this.label) + ' is required.';
    if (this.errors['required']) return this.label + ' is required.';
    return null;
  }

  get finalErrorMessage(): string | null {
    if (!this.isSubmitted) return null;
    return this.errorMessage || this.autoErrorMessage;
  }


}
