import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Injectable({ providedIn: 'root' })
export class CustomDialogService {

  constructor(private dialogService: DialogService) {}

  open<T>(
    component: Type<T>,
    config?: DynamicDialogConfig
  ): DynamicDialogRef<T> | null {
    return this.dialogService.open(component, {
      showHeader: config?.showHeader ?? false,
      // contentStyle: { 'max-height': '70vh', overflow: 'auto' },
      baseZIndex: config?.baseZIndex || 10000,
      width: config?.width || '600px',
      header: config?.header || '',
      data: config?.data || {},
      closable: config?.closable ?? true,
      dismissableMask: true,
      styleClass: config?.styleClass || '',
      modal: true,
      draggable: config?.draggable ?? false,
      resizable: config?.resizable ?? false
    });
  }
}
