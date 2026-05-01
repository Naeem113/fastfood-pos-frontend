import { Component, inject, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { ContentHeader } from '../../../../shared/components/dashboard/content-header/content-header';
import { GridToggleButton } from '../../../../shared/ui/grid-toggle-button/grid-toggle-button';
import { GridListHeader } from '../../../../shared/components/dashboard/grid-list-header/grid-list-header';
import { PRIME_NG_IMPORTS } from '../../../../shared/primeng';
import { Router } from '@angular/router';
import { ConfirmService } from '../../../../core/services/confirm-dialog.service';
import { routesStrings } from '../../../../shared/routes';
import { DiscountType } from '../../../../shared/interfaces/discountType';

type ViewMode = 'grid' | 'list';
type Filter = {
  status: string | boolean
}

interface discount {
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  description: string;
  isActive: boolean;
  branchId: string;
}

@Component({
  selector: 'app-discount-list',
  imports: [
    ...COMMON_IMPORTS,
    ContentHeader,
    GridToggleButton,
    GridListHeader,
    PRIME_NG_IMPORTS
  ],
  templateUrl: './discount-list.html',
  styleUrls: ['./discount-list.scss'],
})
export class DiscountList {

  router = inject(Router);
  confirmService = inject(ConfirmService);

  viewMode = signal<ViewMode>('list');
  currentFilter = signal<Filter>({ status: 'all' });
  selectedDiscounts: discount[] = [];

  discounts: discount[] = [
    { code: 'D1', name: 'Main Discount', type: DiscountType.Percentage, value: 10, description: 'Main discount description', isActive: true, branchId: 'B1' },
    { code: 'D2', name: 'Bar Discount', type: DiscountType.Flat, value: 5, description: 'Bar discount description', isActive: true, branchId: 'B2' },
    { code: 'D3', name: 'Dessert Discount', type: DiscountType.Percentage, value: 15, description: 'Dessert discount description', isActive: false, branchId: 'B1' },


  ];

  filteredDiscounts: discount[] = [];

  statusFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  ngOnInit() {
    this.applyFilter();
  }

  applyFilter() {
    this.filteredDiscounts =
      this.currentFilter().status === 'all'
        ? this.discounts
        : this.discounts.filter(d =>
          this.currentFilter().status === d.isActive
        );
  }

  onStatusFilterChange(status: string | boolean) {
    this.currentFilter.update(filter => ({ ...filter, status }));
    this.applyFilter();
  }

  addDiscount() {
    this.router.navigate([routesStrings.salesAndReturns.discount.create]);
  }

  editDiscount(d: discount) {
    console.log('Edit discount', d);
    this.router.navigate([routesStrings.salesAndReturns.discount.create]);
  }

  onDelete(d: discount, event: Event): void {
    event.stopPropagation();
    console.log('Delete discount:', d.code);
    this.confirmService.delete(
      async () => {
        // Perform delete action here, e.g., call API to delete the discount
        console.log('Discount deleted:', d.code);
        // After deletion, remove the discount from the list
        this.discounts = this.discounts.filter(discount => discount.code !== d.code);
        this.applyFilter();
      },
      `Are you sure you want to delete the discount "${d.name}"?`
    );
  }

  deleteSelectedDiscounts() {
    this.confirmService.delete(
      async () => {
        // Perform delete action here, e.g., call API to delete selected discounts
        console.log('Deleting discounts:', this.selectedDiscounts);
        // After deletion, clear the selection
        this.selectedDiscounts = [];
      }, `Are you sure you want to delete the selected ${this.selectedDiscounts.length} discounts?`
    );
  }
}
