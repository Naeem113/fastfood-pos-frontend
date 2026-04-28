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
import { CoverColorPicker } from '../../../../shared/components/dashboard/cover-color-picker/cover-color-picker';
import { ParentCategoryModal } from '../../../../shared/components/dashboard/modals/parent-category-modal/parent-category-modal';
@Component({
  selector: 'app-items-create',
  imports: [...COMMON_IMPORTS, FloatingInput, FormContentHeader, FormField, FloatingSelect, CoverColorPicker],
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
  selectedCoverColor = signal(this.itemForm().value().coverColor || '#6B7280');

  itemTypes =[
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
  isVariant = () => this.itemForm().value().type === 'variant';
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

  onColorChange(event: string) {
    this.itemForm().controlValue.set({
      ...this.itemForm().value(),
      coverColor: event
    })
  }

  goToItems() {
    this.router.navigate([this.routesStrings.menu.item.list]);
  }

  async openCategoryModal() {
    const ref =this.dialogService.open(ParentCategoryModal, {
      data: {
        title: 'Category',
        description: 'Select a category for this item.',
      }
    });

    ref?.onClose.subscribe((result: any) => {
      if (result) {
        console.log('User selected:', result);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }

  openBranchesModal() {
    const ref =this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Select Branch',
        description: 'Select a branch to assign this item.',
        multiSelect: true,
        value: this.itemForm().value().allowedBranches?this.itemForm().value().allowedBranches:[]
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
        this.itemForm.allowedBranches().value.set(result.map(branch => branch.id));
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }

  addVariant() {
    const form = this.itemForm();

    form.controlValue.set({
      ...form.value(),
      variants: [
        ...(form.value().variants || []),
        { name: '', costPrice: 0, price: 0 }
      ]
    });
  }

  removeVariant(index: number) {
    const form = this.itemForm();
    const variants = [...form.value().variants];

    variants.splice(index, 1);

    form.controlValue.set({
      ...form.value(),
      variants
    });
  }

  updateVariant(index: number, key: string, value: any) {
    const form = this.itemForm();
    const variants = [...form.value().variants];

    variants[index] = {
      ...variants[index],
      [key]: value
    };

    form.controlValue.set({
      ...form.value(),
      variants
    });
  }
}
