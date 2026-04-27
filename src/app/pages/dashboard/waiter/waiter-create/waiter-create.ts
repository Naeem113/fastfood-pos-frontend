import { Component, inject, signal } from '@angular/core';
import { routesStrings } from '../../../../shared/routes';
import { form } from '@angular/forms/signals';
import { waiterFormModel, waiterSchema } from '../form';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CustomDialogService } from '../../../../core/services/custom.dialog.service';
import { BranchesSelectionModal } from '../../../../shared/components/dashboard/modals/branches-selection-modal/branches-selection-modal';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { FloatingInput } from '../../../../shared/ui/floating-input/floating-input';
import { collapse } from '../../../../core/services/animation.service';
import { FormContentHeader } from '../../../../shared/components/dashboard/form-content-header/form-content-header';
import { AuthStore } from '../../../../core/stores/auth.store';
import { BranchDto } from '../../../../shared/models/branch.model';

@Component({
  selector: 'app-waiter-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader],
  templateUrl: './waiter-create.html',
  styleUrl: './waiter-create.scss',
  animations: [collapse]
})
export class WaiterCreate {
   // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  waiterForm = form(waiterFormModel, waiterSchema)
  formSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  showAddress = signal<boolean>(false);
  selectedBranchesNames = signal<string>('');
  selectedBranchesCount = signal<number>(0);
  totalBranchesCount = signal<number>(1);

  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)
  dialogService = inject(CustomDialogService);
  authStore = inject(AuthStore)

  constructor(){
  }


  saveWaiter() {
    this.formSubmitted.set(true);
    // if(this.loading() || this.waiterForm().invalid()) {
    //   return;
    // }
    this.loading.set(true);
    console.log(this.waiterForm().value())
  }

  goToWaiters() {
    this.router.navigate([this.routesStrings.waiter.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this waiter.',
        multiSelect: false,
        value: this.waiterForm().value().branchId?[this.waiterForm().value().branchId]:[]
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
        this.waiterForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }

}
