import { Component, inject, signal } from '@angular/core';
import { FormContentHeader } from '../../../../shared/components/dashboard/form-content-header/form-content-header';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { FloatingInput } from '../../../../shared/ui/floating-input/floating-input';
import { routesStrings } from '../../../../shared/routes';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CustomDialogService } from '../../../../core/services/custom.dialog.service';
import { BranchesSelectionModal } from '../../../../shared/components/dashboard/modals/branches-selection-modal/branches-selection-modal';
import { BranchDto } from '../../../../shared/models/branch.model';
import {  itemFormModel, itemSchema } from '../form';
import { FloatingSelect } from '../../../../shared/ui/floating-select/floating-select';
@Component({
  selector: 'app-items-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, FormField, FloatingSelect],
  templateUrl: './items-create.html',
  styleUrl: './items-create.scss',
})
export class ItemsCreate {
   // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  formSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  seatCapacityList: number[] = [2, 4, 6, 8, 10];
  selectedBranchesCount =  signal<number>(0);
  selectedBranchesNames = signal<string>('');
  totalBranchesCount = signal<number>(1);
  itemForm = form(itemFormModel, itemSchema);
  categories =[
    {
      id: 'food',
      label: 'Prepared food and beverage',
      description: 'Best for restaurants or other food venues.',
      icon: 'food',
    },
    {
      id: 'physical',
      label: 'Physical good',
      description: 'Best for retail items such as clothing or jewelry.',
      icon: 'tag',
    },
    {
      id: 'event',
      label: 'Event',
      description: 'Sell tickets to events and include location address as well as times.',
      icon: 'ticket',
    },
    {
      id: 'donation',
      label: 'Donation',
      description: 'Allow site visitors to select from charitable donation amounts.',
      icon: 'donation',
    },
    {
      id: 'digital',
      label: 'Digital',
      description: 'Lets you provide a digital file for download.',
      icon: 'download',
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Best for items you will fulfill manually.',
      icon: 'box',
    },
  ]
  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)
  dialogService = inject(CustomDialogService);


  saveItem() {
    this.formSubmitted.set(true);
    console.log(this.itemForm);

    if(this.loading() || this.itemForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

  goToItems() {
    this.router.navigate([this.routesStrings.menu.item.list]);
  }

  // openBranchesModal() {
  //   const ref =this.dialogService.open(BranchesSelectionModal, {
  //     data: {
  //       title: 'Select Branch',
  //       description: 'Select a branch to assign this item.',
  //       multiSelect: false,
  //       value: this.itemForm().value().branchId?[this.itemForm().value().branchId]:[]
  //     }
  //   });

  //   ref?.onClose?.subscribe((result: BranchDto[]) => {
  //     if (result) {
  //       console.log('User selected:', result);
  //       this.selectedBranchesCount.set(result.length)
  //       // branch name concatenation
  //       const branchesName = result
  //       .map(branch => branch.name)
  //       .join(', ');
  //       this.selectedBranchesNames.set(branchesName);
  //       this.itemForm().branchId().value.set(result[0].id);
  //     } else {
  //       console.log('Modal dismissed — no selection made');
  //     }
  //   });
  // }
}
