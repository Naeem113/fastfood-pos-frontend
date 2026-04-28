import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  signal,
  ViewChild
} from '@angular/core';

import { COMMON_IMPORTS } from '../../common';
import { slideY } from '../../../core/services/animation.service';

@Component({
  selector: 'app-floating-select',
  imports: [...COMMON_IMPORTS],
  templateUrl: './floating-select.html',
  styleUrl: './floating-select.scss',
  animations: [slideY]
})
export class FloatingSelect {
  private elRef = inject(ElementRef);

  // ─────────────────────────────
  // CONFIG
  // ─────────────────────────────
  @Input() items: any[] = [];

  @Input() labelKey = 'label';
  @Input() valueKey?: string;
  @Input() descriptionKey?: string;
  @Input() iconKey?: string;
  @Input() label = 'Select';
  @Input() placeholder = 'Select item';

  @Input() multiSelection = false; // ⭐ NEW
  @Input() submitted =  signal<boolean>(false);
  @Input() field?: any;
  @Output() valueChange = new EventEmitter<any>();

  // ─────────────────────────────
  // STATE
  // ─────────────────────────────
  isOpen = signal(false);
  openUpward = signal(false);
  isInvalid = signal(false);
  selectedItem = signal<any | null>(null);
  selectedItems = signal<any[]>([]); // ⭐ NEW for multi

  ngOnInit() {
    if (this.field) {
      const value = this.field().value();
      if (value) {
        if (this.multiSelection) {
          const selected = this.items.filter((i: any) =>
            this.valueKey ? value.includes(i[this.valueKey]) : value.includes(i)
          );
          this.selectedItems.set(selected);
        } else {
          const selected = this.items.find((i: any) =>
            this.valueKey ? i[this.valueKey] === value : i === value
          );
          this.selectedItem.set(selected || null);
        }
      }
    }
  }

  @ViewChild('trigger') triggerEl!: ElementRef<HTMLButtonElement>;

  hasError() {
    return (
      this.field().invalid?.() &&
      (this.field().touched?.() || this.submitted())
    );
  }
  // ─────────────────────────────
  // HELPERS
  // ─────────────────────────────
  getLabel(item: any) {
    return item?.[this.labelKey] ?? '';
  }

  getDescription(item: any) {
    return this.descriptionKey ? item?.[this.descriptionKey] : '';
  }

  getIcon(item: any) {
    return this.iconKey ? item?.[this.iconKey] : '';
  }

  displayLabel(): string {
    if (this.multiSelection) {
      const items = this.selectedItems();
      if (!items.length) return this.placeholder;
      return items.map(i => this.getLabel(i)).join(', ');
    }

    return this.selectedItem()
      ? this.getLabel(this.selectedItem())
      : this.placeholder;
  }

  // ─────────────────────────────
  // OPEN / CLOSE
  // ─────────────────────────────
  toggle() {
    if (!this.isOpen()) {
      this.calculateDirection();
    }
    this.isOpen.update(v => !v);
  }

  private calculateDirection() {
    const rect = this.elRef.nativeElement
      .querySelector('button')
      ?.getBoundingClientRect();

    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    this.openUpward.set(spaceBelow < 300 && spaceAbove > spaceBelow);
  }

  // ─────────────────────────────
  // SELECT LOGIC
  // ─────────────────────────────
  select(item: any) {
    const value = this.valueKey ? item[this.valueKey] : item;
    console.log(value);

    // ─── MULTI SELECT ───
    if (this.multiSelection) {
      const current = this.selectedItems();

      const exists = current.some(i =>
        this.valueKey ? i[this.valueKey] === value : i === item
      );

      const updated = exists
        ? current.filter(i =>
            this.valueKey ? i[this.valueKey] !== value : i !== item
          )
        : [...current, item];

      this.selectedItems.set(updated);

      const output = this.valueKey
        ? updated.map(i => i[this.valueKey as keyof typeof i])
        : updated;

      this.valueChange.emit(output);

      if (this.field) {
        this.field().value.set(output);
      }

      return;
    }

    // ─── SINGLE SELECT ───
    this.selectedItem.set(item);
    this.isOpen.set(false);

    this.valueChange.emit(value);

    if (this.field) {
      this.field().value.set(value);
    }
    this.isOpen.set(false)
  }

  // ─────────────────────────────
  // OUTSIDE CLICK
  // ─────────────────────────────
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isOpen()) this.calculateDirection();
  }
}
