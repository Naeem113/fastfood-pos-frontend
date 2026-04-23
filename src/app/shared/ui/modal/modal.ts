import { Component, input, signal, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { COMMON_IMPORTS } from '../../common';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal',
  imports: [...COMMON_IMPORTS],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class Modal {
  private modalService = inject(ModalService);

  // Signals
  readonly isOpen = this.modalService.isOpen;
  readonly config = this.modalService.config;

  close() {
    this.modalService.dismiss();
  }
}
