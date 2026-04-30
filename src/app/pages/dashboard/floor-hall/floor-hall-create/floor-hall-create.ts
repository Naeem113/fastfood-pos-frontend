import { Component, inject, signal } from '@angular/core';
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
import { floorHallFormModel, floorHallSchema } from '../form';

@Component({
  selector: 'app-floor-hall-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, CoverColorPicker],
  templateUrl: './floor-hall-create.html',
  styleUrl: './floor-hall-create.scss',
})
export class FloorHallCreate {
   // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  FloorForm = form(floorHallFormModel, floorHallSchema)
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


  saveFloorHall() {
    this.formSubmitted.set(true);
    if(this.loading() || this.FloorForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

  goToFloorHalls() {
    this.router.navigate([this.routesStrings.restaurantSetup.floorHall.list]);
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this floor hall.',
        multiSelect: false,
        value: this.FloorForm().value().branchId?[this.FloorForm().value().branchId]:[]
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
        this.FloorForm.branchId().value.set(result[0].id);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }
}
