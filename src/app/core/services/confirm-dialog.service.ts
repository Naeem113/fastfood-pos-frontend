import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  header?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptSeverity?: 'primary' | 'danger' | 'success' | 'warn';
  icon?: string;
  action: () => Promise<any>;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  loading = signal(false);
  currentConfig = signal<ConfirmConfig | null>(null);

  // Generic open method
  open(config: ConfirmConfig) {
    this.currentConfig.set(config);
    this.visible.set(true);
  }

  // Call this in accept button
  async accept() {
    const cfg = this.currentConfig();
    if (!cfg) return;

    try {
      this.loading.set(true);
      await cfg.action();      // wait for async operation
      this.visible.set(false); // close after completion
    } finally {
      this.loading.set(false);
    }
  }

  cancel() {
    this.visible.set(false);
  }

  // ===================
  // Shortcuts
  // ===================
  delete(action: () => Promise<any>, message = 'Are you sure you want to delete this record?') {
    this.open({
      header: 'Delete Confirmation',
      message,
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptSeverity: 'danger',
      action
    });
  }

  save(action: () => Promise<any>, message = 'Do you want to save changes?') {
    this.open({
      header: 'Save Changes',
      message,
      icon: 'pi pi-save',
      acceptLabel: 'Save',
      rejectLabel: 'Cancel',
      acceptSeverity: 'success',
      action
    });
  }

  warning(message: string, action: () => Promise<any>) {
    this.open({
      header: 'Warning',
      message,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Continue',
      rejectLabel: 'Cancel',
      acceptSeverity: 'warn',
      action
    });
  }

  archive(action: () => Promise<any>, message = 'Do you want to archive this item?') {
    this.open({
      header: 'Archive',
      message,
      icon: 'pi pi-folder',
      acceptLabel: 'Archive',
      rejectLabel: 'Cancel',
      acceptSeverity: 'primary',
      action
    });
  }

  restore(action: () => Promise<any>, message = 'Do you want to restore this item?') {
    this.open({
      header: 'Restore',
      message,
      icon: 'pi pi-refresh',
      acceptLabel: 'Restore',
      rejectLabel: 'Cancel',
      acceptSeverity: 'success',
      action
    });
  }
}
