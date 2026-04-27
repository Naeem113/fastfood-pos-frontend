import { Component, signal, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PRIME_NG_IMPORTS } from './shared/primeng';
import { ConfirmService } from './core/services/confirm-dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ...PRIME_NG_IMPORTS],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('fastfood-pos-frontend');
  protected readonly isDark = signal(false);
  router = inject(Router);
  confirm = inject(ConfirmService)
  constructor() {
    effect(() => {
      const dark = this.isDark();
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });

    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDark.set(true);
    }
  }

  toggleDarkMode(): void {
    this.isDark.update(value => !value);
  }

  onDialogVisibleChange(visible: any) {
    console.log(visible);

    this.confirm.visible.set(!!visible);
  }
}
