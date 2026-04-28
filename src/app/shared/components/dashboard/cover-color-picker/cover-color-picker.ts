import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { getNameInitials } from '../../../utils/string.util';
import { COMMON_IMPORTS } from '../../../common';

@Component({
  selector: 'app-cover-color-picker',
  imports: [...COMMON_IMPORTS],
  templateUrl: './cover-color-picker.html',
  styleUrl: './cover-color-picker.scss',
})
export class CoverColorPicker {
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() selectedColor = '#6B7280';

  @Output() colorChange = new EventEmitter<string>();

  colors = [
    '#000000', // black
    '#6B7280', // gray
    '#EF4444', // red
    '#ea580c', // orange
    '#d97706',
    '#65a30d', // parrot
    '#16a34a', // green
    '#0d9488',
    '#0891b2',
    '#2563eb', // blue
    '#7c3aed',
    '#c026d3', // purple
  ];

  initialTitle:string = '';


  ngOnChanges() {
    this.initialTitle = getNameInitials(this.firstName, this.lastName);
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.colorChange.emit(color); // 🔥 send to parent
  }
}
