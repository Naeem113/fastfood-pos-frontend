import { Component, inject, Signal, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { form } from '@angular/forms/signals';
import { routesStrings } from '../../../../shared/routes';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { tableFormModel, tableSchema } from '../form';
import { FloatingInput } from '../../../../shared/ui/floating-input/floating-input';
import { CustomDialogService } from '../../../../core/services/custom.dialog.service';
import { BranchesSelectionModal } from '../../../../shared/components/dashboard/modals/branches-selection-modal/branches-selection-modal';
import { FormContentHeader } from '../../../../shared/components/dashboard/form-content-header/form-content-header';
import { BranchDto } from '../../../../shared/models/branch.model';
import { FloatingSelect } from '../../../../shared/ui/floating-select/floating-select';

@Component({
  selector: 'app-table-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, FloatingSelect],
  templateUrl: './table-create.html',
  styleUrls: ['./table-create.scss'],
})
export class TableCreate {
  // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  tableForm = form(tableFormModel, tableSchema)
  formSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  seatCapacityList: number[] = [2, 4, 6, 8, 10];
  selectedBranchesCount =  signal<number>(0);
  selectedBranchesNames = signal<string>('');
  totalBranchesCount = signal<number>(1);
  floors =[
      {
        label: 'Single',
        value: 'single',
        description: 'One type of product.',
      },
      {
        label: 'Variant',
        value: 'variant',
        description: 'Several types of products.',
      }
    ]
  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)
  dialogService = inject(CustomDialogService);


  saveTable() {
    this.formSubmitted.set(true);
    if(this.loading() || this.tableForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

  goToTables() {
    this.router.navigate([this.routesStrings.restaurantSetup.table.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this waiter.',
        multiSelect: false,
        value: this.tableForm().value().branchId?[this.tableForm().value().branchId]:[]
      }
    });

    ref?.onClose?.subscribe((result: BranchDto[]) => {
      if (result) {
        console.log('User selected:', result);
        this.selectedBranchesCount.set(result.length)
        // branch name concatenation
        const branchesName = result
        .map(branch => branch.name)
        .join(', ');
        this.selectedBranchesNames.set(branchesName);
        this.tableForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }
}
