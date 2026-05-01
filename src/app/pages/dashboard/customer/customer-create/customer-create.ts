import { Component, inject, signal } from '@angular/core';
import { routesStrings } from '../../../../shared/routes';
import { form, FormField } from '@angular/forms/signals';
import { customerFormModel, customerSchema } from '../form';
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
import { FloatingSelect } from "../../../../shared/ui/floating-select/floating-select";
import { DiscountType } from '../../../../shared/interfaces/discountType';

@Component({
  selector: 'app-customer-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, FloatingSelect, FormField],
  templateUrl: './customer-create.html',
  styleUrls: ['./customer-create.scss'],
  animations: [collapse]
})
export class CustomerCreate {
// ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  customerForm = form(customerFormModel, customerSchema)
  formSubmitted = signal<boolean>(false);
  discountType = DiscountType
  loading = signal<boolean>(false);
  showAddress = signal<boolean>(false);
  showOtherBio = signal<boolean>(false);
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


  saveCustomer() {
    this.formSubmitted.set(true);
    console.log(this.customerForm().value())
    if(this.loading() || this.customerForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

  goToCustomers() {
    this.router.navigate([this.routesStrings.salesAndReturns.customer.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this customer.',
        multiSelect: false,
        value: this.customerForm().value().branchId?[this.customerForm().value().branchId]:[]
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
        this.customerForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }
}
