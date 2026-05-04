import { Component } from '@angular/core';

@Component({
  selector: 'app-pos-header',
  imports: [],
  templateUrl: './pos-header.html',
  styleUrls: ['./pos-header.scss'],
})
export class PosHeader {
  currentTime = '';
  currentDate = '';
  private clockInterval: any;

  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit(): void {
    this.startClock();
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }

  // ── Clock ──────────────────────────────────────────────
  private startClock(): void {
    const tick = () => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
      this.currentDate = now.toLocaleDateString('en-US', {
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      });
    };
    tick();
    this.clockInterval = setInterval(tick, 1000);
  }
}
