import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_IMPORTS } from '../../../common';

export interface SegmentOption {
  label:   string;
  value:   any;
  danger?: boolean;   // renders label in red (e.g. "Sold out")
}

export interface ChipOption {
  label: string;
  value: any;
}

export interface ExpandRow {
  key:       string;           // unique id
  label:     string;
  icon:      'clock' | 'grid' | 'user' | 'tag' | 'sort';
  chips:     ChipOption[];
  multi?:    boolean;          // true = multi-select chips, false = single (default)
}

export interface FilterPanelConfig {
  segment?:    SegmentOption[];   // top segmented control (optional)
  expandRows?: ExpandRow[];       // collapsible rows
  cancelLabel?: string;
  applyLabel?:  string;
}

export interface FilterPanelResult {
  segment?:  any;               // selected segment value
  [key: string]: any;           // one key per expandRow, value = selected chip value(s)
}
@Component({
  selector: 'app-status-toggler-popover',
  imports: [...COMMON_IMPORTS],
  templateUrl: './status-toggler-popover.html',
  styleUrls: ['./status-toggler-popover.scss'],
})
export class StatusTogglerPopover {

  @Input() config!: FilterPanelConfig;
  @Input() initialValue?: FilterPanelResult;

  @Output() apply  = new EventEmitter<FilterPanelResult>();
  @Output() cancel = new EventEmitter<void>();

  selectedSegment: any = null;
  rowState: Record<string, any> = {};

  get cancelLabel() { return this.config.cancelLabel ?? 'Cancel'; }
  get applyLabel()  { return this.config.applyLabel  ?? 'Apply';  }

  ngOnInit(): void {
    // Init segment
    if (this.config.segment?.length) {
      this.selectedSegment = this.initialValue?.['segment']
        ?? this.config.segment[0].value;
    }

    // Init expand rows
    for (const row of this.config.expandRows ?? []) {
      const init = this.initialValue?.[row.key];
      const defaultVal = row.multi ? (init ?? []) : (init ?? null);
      this.rowState[row.key] = {
        open:     false,
        selected: defaultVal,
        display:  this.toDisplay(defaultVal, row.multi),
      };
    }
  }

  selectSegment(val: any): void {
    this.selectedSegment = val;
  }

  toggleRow(key: string): void {
    this.rowState[key].open = !this.rowState[key].open;
  }

  selectChip(row: ExpandRow, val: any): void {
    const state = this.rowState[row.key];
    if (row.multi) {
      const arr: any[] = [...(state.selected as any[] ?? [])];
      const idx = arr.indexOf(val);
      idx >= 0 ? arr.splice(idx, 1) : arr.push(val);
      state.selected = arr;
    } else {
      state.selected = val;
    }
    state.display = this.toDisplay(state.selected, row.multi);
  }

  isChipActive(row: ExpandRow, val: any): boolean {
    const sel = this.rowState[row.key]?.selected;
    return row.multi ? (sel as any[])?.includes(val) : sel === val;
  }

  onApply(): void {
    const result: FilterPanelResult = {};
    if (this.config.segment) result['segment'] = this.selectedSegment;
    for (const row of this.config.expandRows ?? []) {
      result[row.key] = this.rowState[row.key]?.selected ?? null;
    }
    this.apply.emit(result);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private toDisplay(val: any, multi?: boolean): string {
    if (multi) {
      const arr = val as any[];
      return arr?.length ? arr.join(', ') : 'Any';
    }
    return val != null ? String(val) : 'Any';
  }
}
