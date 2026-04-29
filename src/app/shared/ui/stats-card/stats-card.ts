import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  templateUrl: './stats-card.html',
})
export class StatsCard {
  title = input<string>('');
  value = input<string | number>('');
  icon = input<string>(''); // icon class (e.g. lucide or heroicons)
  trend = input<number | null>(null);
  description = input<string>('');
  color = input<'blue' | 'green' | 'red' | 'yellow' | 'orange'>('blue');

  trendLabel = computed(() => {
    if (this.trend() === null) return '';
    return this.trend()! > 0 ? `+${this.trend()}%` : `${this.trend()}%`;
  });

  trendColor = computed(() => {
    if (this.trend() === null) return '';
    return this.trend()! > 0 ? 'text-green-600' : 'text-red-600';
  });

  colorClasses = computed(() => {
    const map = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return map[this.color()];
  });
}
