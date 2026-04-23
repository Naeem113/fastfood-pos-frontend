import { Injectable, signal, computed } from '@angular/core';

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface ModalConfig<T = any> {
  title: string;
  subtitle?: string;
  data?: T;
}

export interface ModalResult<T = any> {
  confirmed: boolean;
  value?: T;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  // Private signals
  private _isOpen = signal(false);
  private _config = signal<ModalConfig | null>(null);
  private _resolveCallback: ((result: ModalResult) => void) | null = null;

  // Public readonly signals
  readonly isOpen = computed(() => this._isOpen());
  readonly config = computed(() => this._config());

  /**
   * Opens a modal and returns a Promise that resolves when the modal is closed.
   * @param config - Modal configuration
   * @returns Promise<ModalResult> - resolves with { confirmed, value }
   */
  open<T>(config: ModalConfig<T>): Promise<ModalResult<T>> {
    this._config.set(config);
    this._isOpen.set(true);

    return new Promise<ModalResult<T>>((resolve) => {
      this._resolveCallback = resolve as (result: ModalResult) => void;
    });
  }

  /**
   * Closes the modal and resolves the promise with a result.
   * @param value - The selected/confirmed value
   */
  confirm<T>(value: T): void {
    this._resolveCallback?.({ confirmed: true, value });
    this._close();
  }

  /**
   * Dismisses the modal (X button or backdrop click).
   */
  dismiss(): void {
    this._resolveCallback?.({ confirmed: false });
    this._close();
  }

  private _close(): void {
    this._isOpen.set(false);
    this._config.set(null);
    this._resolveCallback = null;
  }
}
