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
import { kitchenFormModel, kitchenSchema } from '../form';
import { CoverColorPicker } from '../../../../shared/components/dashboard/cover-color-picker/cover-color-picker';

@Component({
  selector: 'app-kitchen-station-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, CoverColorPicker],
  templateUrl: './kitchen-station-create.html',
  styleUrl: './kitchen-station-create.scss',
})
export class KitchenStationCreate {
  // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  kitchenForm = form(kitchenFormModel, kitchenSchema)
  formSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  selectedBranchesCount =  signal<number>(0);
  selectedBranchesNames = signal<string>('');
  totalBranchesCount = signal<number>(1);

  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)
  dialogService = inject(CustomDialogService);


  saveKitchen() {
    this.formSubmitted.set(true);
    if(this.loading() || this.kitchenForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

    onColorChange(color:string){
    this.kitchenForm().value.set({
      ...this.kitchenForm().value(),
      color
    })
  }

  goToKitchenStations() {
    this.router.navigate([this.routesStrings.restaurantSetup.kitchenStation.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this kitchen station.',
        multiSelect: false,
        value: this.kitchenForm().value().branchId?[this.kitchenForm().value().branchId]:[]
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
        this.kitchenForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }
}
