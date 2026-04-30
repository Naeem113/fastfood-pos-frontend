import { Component, inject, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { ContentHeader } from '../../../../shared/components/dashboard/content-header/content-header';
import { GridToggleButton } from '../../../../shared/ui/grid-toggle-button/grid-toggle-button';
import { GridListHeader } from '../../../../shared/components/dashboard/grid-list-header/grid-list-header';
import { PRIME_NG_IMPORTS } from '../../../../shared/primeng';
import { Router } from '@angular/router';
import { ConfirmService } from '../../../../core/services/confirm-dialog.service';
import { routesStrings } from '../../../../shared/routes';

type ViewMode = 'grid' | 'list';

type Filter = {
  status: string | boolean;
};

interface Floor {
  id: string;
  name: string;
  branch: string;
  active: boolean;
  tableCount?: number;
}

@Component({
  selector: 'app-floor-hall-list',
  standalone: true,
  imports: [
    ...COMMON_IMPORTS,
    ContentHeader,
    GridToggleButton,
    GridListHeader,
    PRIME_NG_IMPORTS
  ],
  templateUrl: './floor-hall-list.html',
  styleUrls: ['./floor-hall-list.scss']
})
export class FloorHallList {

  router = inject(Router);
  confirmService = inject(ConfirmService);

  viewMode = signal<ViewMode>('grid');
  currentFilter = signal<Filter>({ status: 'all' });
  selectedFloors: Floor[] = [];

  floors: Floor[] = [
    { id: 'F1', name: 'Main Hall', branch: 'Main', active: true, tableCount: 12 },
    { id: 'F2', name: 'Rooftop', branch: 'Main', active: true, tableCount: 8 },
    { id: 'F3', name: 'VIP Lounge', branch: 'Main', active: false, tableCount: 4 },
  ];

  filteredFloors: Floor[] = [];

  statusFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  ngOnInit() {
    this.applyFilter();
  }

  // ✅ Stats
  get stats() {
    return [
      {
        label: 'Total',
        value: this.floors.length,
        sub: 'All floors',
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        subText: 'text-blue-400',
        icon: 'pi pi-building'
      },
      {
        label: 'Active',
        value: this.floors.filter(f => f.active).length,
        sub: 'In service',
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        subText: 'text-emerald-400',
        icon: 'pi pi-check'
      },
      {
        label: 'Inactive',
        value: this.floors.filter(f => !f.active).length,
        sub: 'Hidden from POS',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        subText: 'text-gray-400',
        icon: 'pi pi-ban'
      }
    ];
  }

  // ✅ Filter
  applyFilter() {
    this.filteredFloors =
      this.currentFilter().status === 'all'
        ? this.floors
        : this.floors.filter(f => f.active === this.currentFilter().status);
  }

  onStatusFilterChange(status: string | boolean) {
    this.currentFilter.update(f => ({ ...f, status }));
    this.applyFilter();
  }

  // ✅ Actions
  addFloorHall() {
    this.router.navigate([routesStrings.restaurantSetup.floorHall.create]);
  }

  editFloorHall(floorHall: Floor) {
    this.router.navigate([routesStrings.restaurantSetup.floorHall.create]);
  }

  onDeleteFloorHall(floorHall: Floor, event: Event) {
    event.stopPropagation();

    this.confirmService.delete(
      async () => {
        this.floors = this.floors.filter(f => f.id !== floorHall.id);
        this.applyFilter();
      },
      `Are you sure you want to delete floor hall "${floorHall.name}"?`
    );
  }

  deleteSelectedFloorHalls() {
    this.confirmService.delete(
      async () => {
        this.selectedFloors = [];
      },
      `Delete ${this.selectedFloors.length} selected floors/halls?`
    );
  }
}
