import { Component, inject, Signal, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { form } from '@angular/forms/signals';
import { routesStrings } from '../../../../shared/routes';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { FloatingInput } from '../../../../shared/ui/floating-input/floating-input';
import { CustomDialogService } from '../../../../core/services/custom.dialog.service';
import { BranchesSelectionModal } from '../../../../shared/components/dashboard/modals/branches-selection-modal/branches-selection-modal';
import { FormContentHeader } from '../../../../shared/components/dashboard/form-content-header/form-content-header';
import { BranchDto } from '../../../../shared/models/branch.model';
import { CoverColorPicker } from '../../../../shared/components/dashboard/cover-color-picker/cover-color-picker';
import { discountFormModel, discountSchema } from '../form';
import { FloatingSelect } from '../../../../shared/ui/floating-select/floating-select';
import { DiscountType } from '../../../../shared/interfaces/discountType';
import { collapse } from '../../../../core/services/animation.service';

@Component({
  selector: 'app-discount-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, CoverColorPicker, FloatingSelect],
  templateUrl: './discount-create.html',
  styleUrls: ['./discount-create.scss'],
  animations: [collapse]
})
export class DiscountCreate {
  // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  discountForm = form(discountFormModel, discountSchema)
  formSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  selectedBranchesCount =  signal<number>(0);
  selectedBranchesNames = signal<string>('');
  totalBranchesCount = signal<number>(1);
  discountType = DiscountType
  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)
  dialogService = inject(CustomDialogService);


  saveDiscount() {
    this.formSubmitted.set(true);
    if(this.loading() || this.discountForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }


  goToDiscountList() {
    this.router.navigate([this.routesStrings.salesAndReturns.discount.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this discount.',
        multiSelect: false,
        value: this.discountForm().value().branchId?[this.discountForm().value().branchId]:[]
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
        this.discountForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }
}
