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
  status:string | boolean
}
interface Kitchen {
  id: string;
  name: string;
  branch: string;
  color: string;
  active: boolean;
}

@Component({
  selector: 'app-kitchen-station-list',
  imports: [
    ...COMMON_IMPORTS,
    ContentHeader,
    GridToggleButton,
    GridListHeader,
    PRIME_NG_IMPORTS
  ],
  templateUrl: './kitchen-station-list.html'
})
export class KitchenStationList {

  router = inject(Router);
  confirmService = inject(ConfirmService);
  viewMode = signal<ViewMode>('grid');
  currentFilter = signal<Filter>({status:'all'});
  selectedKitchens: Kitchen[] = [];

  kitchens: Kitchen[] = [
    { id: 'K1', name: 'Main Kitchen', branch: 'Main', color: '#10B981', active: true },
    { id: 'K2', name: 'Bar', branch: 'Bar Area', color: '#F59E0B', active: true },
    { id: 'K3', name: 'Dessert', branch: 'Main', color: '#EF4444', active: false },


  ];

  filteredKitchens: Kitchen[] = [];

  statusFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  ngOnInit() {
    this.applyFilter();
  }

  get stats() {
    return [
      {
        label: 'Total',
        value: this.kitchens.length,
        sub: 'All kitchens',
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        subText: 'text-blue-400',
        icon: 'pi pi-th-large'
      },
      {
        label: 'Active',
        value: this.kitchens.filter(k => k.active).length,
        sub: 'In use',
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
        subText: 'text-emerald-400',
        icon: 'pi pi-check'
      },
      {
        label: 'Inactive',
        value: this.kitchens.filter(k => !k.active).length,
        sub: 'Disabled',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        subText: 'text-gray-400',
        icon: 'pi pi-ban'
      }
    ];
  }

  applyFilter() {
    this.filteredKitchens =
      this.currentFilter().status === 'all'
        ? this.kitchens
        : this.kitchens.filter(k =>
            this.currentFilter().status === k.active
          );
  }

  onStatusFilterChange(status: string | boolean) {
    this.currentFilter.update(filter => ({ ...filter, status }));
    this.applyFilter();
  }

  addKitchen() {
    this.router.navigate([routesStrings.restaurantSetup.kitchenStation.create]);
  }

  editKitchen(k: Kitchen) {
    console.log('Edit kitchen', k);
    this.router.navigate([routesStrings.restaurantSetup.kitchenStation.create]);
  }

  onDelete(k: Kitchen, event: Event): void {
    event.stopPropagation();
    console.log('Delete kitchen:', k.id);
    this.confirmService.delete(
      async () => {
        // Perform delete action here, e.g., call API to delete the kitchen
        console.log('Kitchen deleted:', k.id);
        // After deletion, remove the kitchen from the list
        this.kitchens = this.kitchens.filter(kit => kit.id !== k.id);
        this.applyFilter();
      },
      `Are you sure you want to delete the kitchen "${k.name}"?`
    );
  }

  deleteSelectedKitchens() {
    this.confirmService.delete(
      async() => {
        // Perform delete action here, e.g., call API to delete selected tables
        console.log('Deleting kitchens:', this.selectedKitchens);
        // After deletion, clear the selection
        this.selectedKitchens = [];
      }, `Are you sure you want to delete the selected ${this.selectedKitchens.length} kitchens?`
    );
  }
}
