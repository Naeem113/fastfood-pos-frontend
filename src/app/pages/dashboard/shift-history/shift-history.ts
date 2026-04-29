import { Component, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../shared/common';
import { ContentHeader } from '../../../shared/components/dashboard/content-header/content-header';
import { StatsCard } from '../../../shared/ui/stats-card/stats-card';
import { ShiftDTO } from '../../../shared/interfaces/shift';
import { collapse } from '../../../core/services/animation.service';

@Component({
  selector: 'app-shift-history',
  imports: [...COMMON_IMPORTS, ContentHeader, StatsCard],
  templateUrl: './shift-history.html',
  styleUrl: './shift-history.scss',
  animations: [ collapse ]
})
export class ShiftHistory {
  expandedId: string | null = null;

  // ✅ Dummy Data
  filteredShifts: ShiftDTO[] = [
    {
      _id: '1',
      userId: '1',
      user: { name: 'Ali Raza' },
      shiftName: 'Morning',
      openingTime: new Date('2026-04-28T09:00:00'),
      totalSales: 24500,
      ordersCount: 32,
      openingCash: 5000,
      status: 'OPEN',
      paymentSummary: {
        cash: 12000,
        card: 8000,
        online: 4500,
      },
    },
    {
      _id: '2',
      userId: '2',
      user: { name: 'Sara Khan' },
      shiftName: 'Evening',
      openingTime: new Date('2026-04-27T16:00:00'),
      closingTime: new Date('2026-04-27T23:00:00'),
      totalSales: 40200,
      ordersCount: 58,
      openingCash: 7000,
      closingCash: 46000,
      status: 'CLOSED',
      paymentSummary: {
        cash: 20000,
        card: 15000,
        online: 5200,
      },
    },
    {
      _id: '3',
      userId: '3',
      user: { name: 'Usman Tariq' },
      shiftName: 'Night',
      openingTime: new Date('2026-04-26T22:00:00'),
      closingTime: new Date('2026-04-27T06:00:00'),
      totalSales: 18900,
      ordersCount: 21,
      openingCash: 4000,
      closingCash: 21000,
      status: 'CLOSED',
      paymentSummary: {
        cash: 9000,
        card: 6000,
        online: 3900,
      },
    }
  ];

  // ✅ Toggle expand
  toggleDetail(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  // ✅ TrackBy (important for performance)
  trackById(index: number, item: ShiftDTO): string {
    return item._id;
  }

  // ✅ Initials (Avatar)
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // ✅ Avg Order
  getAvgOrder(shift: ShiftDTO): number {
    if (!shift.ordersCount) return 0;
    return Math.round(shift.totalSales / shift.ordersCount);
  }

  // ✅ Percent helpers
  private getTotal(shift: ShiftDTO): number {
    return shift.totalSales || 1;
  }

  getCashPct(shift: ShiftDTO): number {
    return Math.round((shift.paymentSummary.cash / this.getTotal(shift)) * 100);
  }

  getCardPct(shift: ShiftDTO): number {
    return Math.round((shift.paymentSummary.card / this.getTotal(shift)) * 100);
  }

  getOnlinePct(shift: ShiftDTO): number {
    return Math.round((shift.paymentSummary.online / this.getTotal(shift)) * 100);
  }

  // ✅ Difference
  getDifference(shift: ShiftDTO): number {
    if (!shift.closingCash) return 0;
    return shift.closingCash - shift.openingCash - shift.totalSales;
  }

  formatDifference(shift: ShiftDTO): string {
    const diff = this.getDifference(shift);

    if (!shift.closingCash) return '—';

    if (diff === 0) return '0';

    return diff > 0 ? `+${diff}` : `${diff}`;
  }
}
