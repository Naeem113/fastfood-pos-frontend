import { Component, signal, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ToastModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('fastfood-pos-frontend');
  protected readonly isDark = signal(false);
  router = inject(Router);
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
}
