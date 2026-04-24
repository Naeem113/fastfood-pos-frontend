import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_IMPORTS } from '../../../common';

@Component({
  selector: 'app-content-header',
  imports: [...COMMON_IMPORTS],
  templateUrl: './content-header.html',
  styleUrl: './content-header.scss',
})
export class ContentHeader {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() showButton: boolean = true;
  @Input() buttonText: string = '';
  @Input() buttonIcon: string = '';
  @Output() buttonClick = new EventEmitter<void>();

}
