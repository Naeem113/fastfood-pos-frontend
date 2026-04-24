import { Component, input, signal, Output, EventEmitter, HostListener, inject, Input } from '@angular/core';
import { COMMON_IMPORTS } from '../../common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal',
  imports: [...COMMON_IMPORTS],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class Modal {

  @Input() submittedData: any;
  ref: DynamicDialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  closeDialog() {
    this.ref.close(null);
  }

  save() {
    this.ref.close(this.submittedData);
  }
}
