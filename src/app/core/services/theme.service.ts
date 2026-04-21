import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // reactive state (Angular 20+ signal)
  isDark = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  toggleTheme() {
    this.isDark.update(value => !value);
    this.applyTheme();
    this.saveTheme();
  }

  private applyTheme() {
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private saveTheme() {
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }

  private initTheme() {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
      this.isDark.set(true);
      document.documentElement.classList.add('dark');
    }
  }
}
