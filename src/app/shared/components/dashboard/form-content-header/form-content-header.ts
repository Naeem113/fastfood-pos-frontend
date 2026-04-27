import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-content-header',
  imports: [],
  templateUrl: './form-content-header.html',
  styleUrl: './form-content-header.scss',
})
export class FormContentHeader {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Input() buttonIcon: string = '';
  @Output() buttonClick = new EventEmitter<void>();
  @Output() closeClick = new EventEmitter<void>();
}
