import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  success(message: string, summary = 'Success') {
    this.messageService.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000
    });
  }

  error(message: string, summary = 'Error') {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: message,
      life: 4000
    });
  }

  warning(message: string, summary = 'Warning') {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 3000
    });
  }

  info(message: string, summary = 'Info') {
    this.messageService.add({
      severity: 'info',
      summary,
      detail: message,
      life: 3000
    });
  }

  // 🔥 Custom (like your old system)
  showCustom(options: {
    severity?: 'success' | 'info' | 'warn' | 'error',
    summary?: string,
    detail: string,
    life?: number,
    sticky?: boolean
  }) {
    this.messageService.add({
      severity: options.severity || 'info',
      summary: options.summary,
      detail: options.detail,
      life: options.sticky ? undefined : (options.life || 3000),
      sticky: options.sticky || false
    });
  }

  clear() {
    this.messageService.clear();
  }
}
