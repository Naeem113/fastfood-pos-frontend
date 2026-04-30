import { Component, inject, signal } from '@angular/core';
import { routesStrings } from '../../../../shared/routes';
import { form } from '@angular/forms/signals';
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
import { riderFormModel, riderSchema } from '../form';

@Component({
  selector: 'app-rider-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader],
  templateUrl: './rider-create.html',
  styleUrl: './rider-create.scss',
  animations: [collapse]
})
export class RiderCreate {
   // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  riderForm = form(riderFormModel, riderSchema)
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


  saveRider() {
    this.formSubmitted.set(true);
    console.log(this.riderForm().value())
    if(this.loading() || this.riderForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

  goToRiders() {
    this.router.navigate([this.routesStrings.restaurantSetup.rider.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this rider.',
        multiSelect: false,
        value: this.riderForm().value().branchId?[this.riderForm().value().branchId]:[]
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
        this.riderForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }

}
