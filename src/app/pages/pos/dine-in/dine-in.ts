import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Router }       from '@angular/router';
import { COMMON_IMPORTS } from '../../../shared/common';
import { routesStrings } from '../../../shared/routes';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';

export interface TableDto {
  id:              string;
  name:            string;
  seats:           number;
  status:          TableStatus;
  floorId:         string;
  waiter?:         string;    // set when OCCUPIED
  duration?:       string;    // e.g. "42 min" — set when OCCUPIED
  reservationTime?: string;   // e.g. "7:30 PM" — set when RESERVED
  guestName?:      string;    // set when RESERVED
}

export interface FloorDto {
  id:     string;
  name:   string;
  icon:   string;
  tables: TableDto[];
}
@Component({
  selector: 'app-dine-in',
  imports: [...COMMON_IMPORTS],
  templateUrl: './dine-in.html',
  styleUrl: './dine-in.scss',
})
export class DineIn {

  router = inject(Router);
  currentTime = '';
  currentDate = '';
  private clockInterval: any;

  searchQuery  = '';
  statusFilter: TableStatus | '' = '';

  floors: FloorDto[] = [];
  selectedFloor: FloorDto | null = null;

  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit(): void {
    this.floors = MOCK_FLOORS;
    this.selectedFloor = this.floors[0] ?? null;
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

  // ── Floor ──────────────────────────────────────────────
  selectFloor(floor: FloorDto): void {
    this.selectedFloor = floor;
    this.searchQuery   = '';
    this.statusFilter  = '';
  }

  getFloorAvailableCount(floor: FloorDto): number {
    return floor.tables.filter(t => t.status === 'AVAILABLE').length;
  }

  // ── Filtered tables ────────────────────────────────────
  get filteredTables(): TableDto[] {
    if (!this.selectedFloor) return [];
    const q = this.searchQuery.toLowerCase().trim();
    return this.selectedFloor.tables.filter(t => {
      const matchQ = !q || t.name.toLowerCase().includes(q);
      const matchS = !this.statusFilter || t.status === this.statusFilter;
      return matchQ && matchS;
    });
  }

  // ── Stats ──────────────────────────────────────────────
  getStatusCount(status: TableStatus): number {
    return this.selectedFloor?.tables.filter(t => t.status === status).length ?? 0;
  }

  // ── Table selection ────────────────────────────────────
  selectTable(table: TableDto): void {
    if (table.status !== 'AVAILABLE') return;
    console.log('Selected table:', table);
    // navigate to order screen: this.router.navigate(['/pos/order'], { queryParams: { tableId: table.id } });
  }

  goBack(): void {
    this.router.navigate([routesStrings.pos.index]);
    console.log('Navigate back to POS home');
  }

  // ── Styling helpers ────────────────────────────────────
  getTableClasses(table: TableDto): string {
    const base = 'border-2 ';
    switch (table.status) {
      case 'AVAILABLE': return base + 'bg-white border-emerald-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100 hover:-translate-y-0.5';
      case 'OCCUPIED':  return base + 'bg-rose-50   border-rose-200   cursor-not-allowed opacity-90';
      case 'RESERVED':  return base + 'bg-amber-50  border-amber-200  cursor-not-allowed opacity-90';
      case 'CLEANING':  return base + 'bg-blue-50   border-blue-200   cursor-not-allowed opacity-75';
    }
  }

  getStatusDotClass(status: TableStatus): string {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500 animate-pulse';
      case 'OCCUPIED':  return 'bg-rose-500';
      case 'RESERVED':  return 'bg-amber-400';
      case 'CLEANING':  return 'bg-blue-400';
    }
  }

  getTableTextClass(status: TableStatus): string {
    switch (status) {
      case 'AVAILABLE': return 'text-gray-800';
      case 'OCCUPIED':  return 'text-rose-700';
      case 'RESERVED':  return 'text-amber-700';
      case 'CLEANING':  return 'text-blue-700';
    }
  }

  getTableSubTextClass(status: TableStatus): string {
    switch (status) {
      case 'AVAILABLE': return 'text-gray-400';
      case 'OCCUPIED':  return 'text-rose-400';
      case 'RESERVED':  return 'text-amber-500';
      case 'CLEANING':  return 'text-blue-400';
    }
  }

  getTableColor(status: TableStatus): string {
    switch (status) {
      case 'AVAILABLE': return '#1D9E75';
      case 'OCCUPIED':  return '#F87171';
      case 'RESERVED':  return '#FBBF24';
      case 'CLEANING':  return '#60A5FA';
    }
  }

  getChairColor(status: TableStatus): string {
    switch (status) {
      case 'AVAILABLE': return '#9FE1CB';
      case 'OCCUPIED':  return '#FCA5A5';
      case 'RESERVED':  return '#FDE68A';
      case 'CLEANING':  return '#BFDBFE';
    }
  }

  getTableSize(seats: number): { w: number; h: number } {
    return seats <= 4 ? { w: 64, h: 52 } : { w: 72, h: 52 };
  }

  getChairPositions(seats: number, row: 'top' | 'bottom'): { x: number; y: number }[] {
    const n    = Math.min(seats, 6);
    const half = Math.ceil(n / 2);
    const gapX = 14;
    const startX = (64 - half * 10 - (half - 1) * gapX) / 2;
    const yTop = 2, yBot = 41;
    return Array.from({ length: half }, (_, i) => ({
      x: startX + i * (10 + gapX),
      y: row === 'top' ? yTop : yBot,
    }));
  }
}

// ── Mock data ──────────────────────────────────────────
const MOCK_FLOORS: FloorDto[] = [
  {
    id: 'f1', name: 'Ground floor', icon: '🏠',
    tables: [
      { id:'t01', name:'Table 01', seats:2, floorId:'f1', status:'AVAILABLE' },
      { id:'t02', name:'Table 02', seats:4, floorId:'f1', status:'OCCUPIED',  waiter:'Ahmed K.',  duration:'42 min' },
      { id:'t03', name:'Table 03', seats:4, floorId:'f1', status:'AVAILABLE' },
      { id:'t04', name:'Table 04', seats:6, floorId:'f1', status:'RESERVED',  reservationTime:'7:30 PM', guestName:'Chen family' },
      { id:'t05', name:'Table 05', seats:2, floorId:'f1', status:'AVAILABLE' },
      { id:'t06', name:'Table 06', seats:4, floorId:'f1', status:'OCCUPIED',  waiter:'Sara M.',   duration:'15 min' },
      { id:'t07', name:'Table 07', seats:2, floorId:'f1', status:'CLEANING'  },
      { id:'t08', name:'Table 08', seats:6, floorId:'f1', status:'AVAILABLE' },
      { id:'t09', name:'Table 09', seats:4, floorId:'f1', status:'OCCUPIED',  waiter:'Nadia S.',  duration:'58 min' },
      { id:'t10', name:'Table 10', seats:2, floorId:'f1', status:'AVAILABLE' },
    ],
  },
  {
    id: 'f2', name: 'First floor', icon: '🏢',
    tables: [
      { id:'t11', name:'Table 11', seats:4, floorId:'f2', status:'AVAILABLE' },
      { id:'t12', name:'Table 12', seats:6, floorId:'f2', status:'OCCUPIED',  waiter:'Bilal H.',  duration:'22 min' },
      { id:'t13', name:'Table 13', seats:2, floorId:'f2', status:'RESERVED',  reservationTime:'8:00 PM', guestName:'Johnson x3' },
      { id:'t14', name:'Table 14', seats:4, floorId:'f2', status:'AVAILABLE' },
      { id:'t15', name:'Table 15', seats:8, floorId:'f2', status:'AVAILABLE' },
      { id:'t16', name:'Table 16', seats:4, floorId:'f2', status:'OCCUPIED',  waiter:'Omar S.',   duration:'7 min'  },
    ],
  },
  {
    id: 'f3', name: 'Rooftop', icon: '☀️',
    tables: [
      { id:'t17', name:'Table 17', seats:2, floorId:'f3', status:'AVAILABLE' },
      { id:'t18', name:'Table 18', seats:4, floorId:'f3', status:'AVAILABLE' },
      { id:'t19', name:'Table 19', seats:6, floorId:'f3', status:'RESERVED',  reservationTime:'9:00 PM', guestName:'VIP booth'  },
      { id:'t20', name:'Table 20', seats:4, floorId:'f3', status:'CLEANING'  },
    ],
  },
  {
    id: 'f4', name: 'Private', icon: '🔒',
    tables: [
      { id:'t21', name:'Private A', seats:8,  floorId:'f4', status:'AVAILABLE' },
      { id:'t22', name:'Private B', seats:10, floorId:'f4', status:'OCCUPIED', waiter:'Manager', duration:'1h 12m' },
      { id:'t23', name:'Private C', seats:12, floorId:'f4', status:'RESERVED', reservationTime:'8:30 PM', guestName:'Corporate event' },
    ],
  },
];

