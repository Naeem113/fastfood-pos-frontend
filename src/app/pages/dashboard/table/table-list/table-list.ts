import { Component, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { FilterMode, RestaurantTable, ViewMode } from '../../../../shared/models/table.model';
import { TableStatus } from '../../../../shared/enums/tableStatus';
import { routesStrings } from '../../../../shared/routes';
interface StatCard {
  type: 'total' | 'available' | 'occupied' | 'reserved';
  label: string;
  value: number;
  sub: string;
}
@Component({
  selector: 'app-table-list',
  imports: [...COMMON_IMPORTS],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList {
  routesString =  routesStrings
  viewMode = signal<ViewMode>('grid');
  currentFilter = signal<FilterMode>('all');

  readonly filterOptions: { label: string; value: FilterMode }[] = [
    { label: 'All',       value: 'all'       },
    { label: 'Available', value: TableStatus.Available },
    { label: 'Occupied',  value: TableStatus.Occupied },
    { label: 'Reserved',  value: TableStatus.Reserved },
  ];

  private readonly allTables: RestaurantTable[] = [
    { id: 'T-01', status: TableStatus.Occupied,  section: 'Main',    seats: 2,  guest: 'Williams',   time: '7:30 PM', duration: '45 min' },
    { id: 'T-02', status: TableStatus.Available, section: 'Main',    seats: 4,  guest: null,          time: null,      duration: null     },
    { id: 'T-03', status: TableStatus.Occupied,  section: 'Main',    seats: 4,  guest: 'Martinez',    time: '8:00 PM', duration: '20 min' },
    { id: 'T-04', status: TableStatus.Reserved,  section: 'Main',    seats: 6,  guest: 'Chen party',  time: '8:30 PM', duration: null     },
    { id: 'T-05', status: TableStatus.Available, section: 'Main',    seats: 2,  guest: null,          time: null,      duration: null     },
    { id: 'T-06', status: TableStatus.Occupied,  section: 'Patio',   seats: 4,  guest: 'Thompson',    time: '7:15 PM', duration: '55 min' },
    { id: 'T-07', status: TableStatus.Occupied,  section: 'Patio',   seats: 2,  guest: 'Davis',       time: '8:10 PM', duration: '10 min' },
    { id: 'T-08', status: TableStatus.Available, section: 'Patio',   seats: 6,  guest: null,          time: null,      duration: null     },
    { id: 'T-09', status: TableStatus.Reserved,  section: 'Private', seats: 8,  guest: 'Johnson x8',  time: '9:00 PM', duration: null     },
    { id: 'T-10', status: TableStatus.Occupied,  section: 'Bar',     seats: 2,  guest: 'Garcia',      time: '8:45 PM', duration: '5 min'  },
    { id: 'T-11', status: TableStatus.Available, section: 'Bar',     seats: 2,  guest: null,          time: null,      duration: null     },
    { id: 'T-12', status: TableStatus.Available, section: 'Private', seats: 10, guest: null,          time: null,      duration: null     },
  ];

  filteredTables: RestaurantTable[] = [];

  get totalCount():     number { return this.filteredTables.length; }
  get availableCount(): number { return this.filteredTables.filter(t => t.status === TableStatus.Available).length; }
  get occupiedCount():  number { return this.filteredTables.filter(t => t.status === TableStatus.Occupied).length;  }
  get reservedCount():  number { return this.filteredTables.filter(t => t.status === TableStatus.Reserved).length;  }

  get stats(): StatCard[] {
    const f = this.filteredTables;
    return [
      { type: 'total',     label: 'Total tables',    value: f.length,                                   sub: `${this.allTables.length} overall`  },
      { type: 'available', label: 'Available',        value: f.filter(t=>t.status==='available').length, sub: 'Ready to seat'                     },
      { type: 'occupied',  label: 'Occupied',         value: f.filter(t=>t.status==='occupied').length,  sub: 'Currently dining'                  },
      { type: 'reserved',  label: 'Reserved',         value: f.filter(t=>t.status==='reserved').length,  sub: 'Upcoming bookings'                 },
    ];
  }

  ngOnInit(): void {
    this.applyFilter();
  }

  setFilter(filter: FilterMode): void {
    this.currentFilter.set(filter);
    this.applyFilter();
  }

  setView(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  getChairArray(table: RestaurantTable): number[] {
    return Array.from({ length: Math.min(table.seats, 6) });
  }

  getStatusLabel(status: TableStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  trackById(_: number, table: RestaurantTable): string {
    return table.id;
  }

  private applyFilter(): void {
    this.filteredTables = this.currentFilter() === 'all'
      ? [...this.allTables]
      : this.allTables.filter(t => t.status === this.currentFilter());
  }
}
