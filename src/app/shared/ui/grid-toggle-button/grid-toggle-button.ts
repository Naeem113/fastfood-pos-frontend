import { Component, Input, Output, EventEmitter } from '@angular/core';
import { COMMON_IMPORTS } from '../../common';

export type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-grid-toggle-button',
  standalone: true,
  imports: [...COMMON_IMPORTS],
  templateUrl: './grid-toggle-button.html',
  styleUrl: './grid-toggle-button.scss',
})
export class GridToggleButton {

  @Input() value: ViewMode = 'grid';
  @Output() valueChange = new EventEmitter<ViewMode>();

  setView(mode: ViewMode) {
    if (this.value !== mode) {
      this.value = mode;
      this.valueChange.emit(mode);
    }
  }
}
