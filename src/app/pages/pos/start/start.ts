import { Component, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../shared/common';

@Component({
  selector: 'app-start',
  imports: [...COMMON_IMPORTS],
  templateUrl: './start.html',
  styleUrl: './start.scss',
})
export class Start {
    time = signal('');
  date = signal('');
  loading = signal(false);
  started = signal(false);

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.date.set(
      new Date().toLocaleDateString('en-PK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    );
  }

  updateTime() {
    this.time.set(
      new Date().toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    );
  }

  startShift() {
    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.started.set(true);
    }, 2000);
  }
}
