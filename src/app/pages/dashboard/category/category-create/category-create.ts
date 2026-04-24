import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { routesStrings } from '../../../../shared/routes';
import { categoryFormModel, categorySchema } from '../form';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { form, FormField } from '@angular/forms/signals';
import { ApiService } from '../../../../core/services/api.service';
import { CoverColorPicker } from '../../../../shared/components/dashboard/cover-color-picker/cover-color-picker';
import { MediaPicker } from '../../../../shared/components/dashboard/media-picker/media-picker';
import { ParentCategoryModal } from '../../../../shared/components/dashboard/modals/parent-category-modal/parent-category-modal';
import { Category } from '../category';
import { ModalService } from '../../../../core/services/modal.service';
import { BranchesSelectionModal } from '../../../../shared/components/dashboard/modals/branches-selection-modal/branches-selection-modal';
import { BranchDto } from '../../../../shared/models/branch.model';
import { CustomDialogService } from '../../../../core/services/custom.dialog.service';

@Component({
  selector: 'app-category-create',
  imports: [...COMMON_IMPORTS, FormField, CoverColorPicker, MediaPicker],
  templateUrl: './category-create.html',
  styleUrls: ['./category-create.scss'],
})
export class CategoryCreate {

  // ========================
  // Variables & signals
  // ========================
  routesStrings =  routesStrings
  categoryForm = form(categoryFormModel, categorySchema)
  formSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);
  selectedColor = signal(this.categoryForm().value().color);
  selectedFile: File | null = null;
  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)
  dialogService = inject(CustomDialogService);


  saveCategory() {
    this.formSubmitted.set(true);
    if(this.loading() || this.categoryForm().invalid()) {
      return;
    }
    this.loading.set(true);
    // try {
    //   const payload = this.categoryForm().value();
    //   console.log('Login attempt:', payload);
    //   await this.authStore.login(username, password)
    // } catch (error: any) {
    //   console.log(error);

    //   this.errorMessage.set(error?.message || 'Login failed. Please try again.');
    //   this.toast.error(this.errorMessage() as string);
    // } finally {
    //   this.loading.set(false);
    //   this.formSubmitted.set(false);
    // }


  }

  goToCategories() {
    this.router.navigate([this.routesStrings.category.list]);
  }

  private modalService = inject(ModalService);
  selectedCategory: Category | null = null;

  async openCategoryModal() {
    const ref =this.dialogService.open(ParentCategoryModal, {
      data: {
        title: 'Parent Category',
        description: 'Select a parent category to nest this category underneath it.',
      }
    });

    ref?.onClose.subscribe((result: Category) => {
      if (result) {
        this.selectedCategory = result;
        console.log('User selected:', result);
      } else {
        console.log('Modal dismissed — no selection made');
      }
    });
  }

  async openBranchesModal() {
    const ref = this.dialogService.open(BranchesSelectionModal, {
      data: {
        title: 'Branch / Outlet Association',
        description: 'Select a branch to associate this category with.',
      }
    });
    ref?.onClose.subscribe((result: BranchDto) => {
      if (result) {
        console.log('User selected branch:', result);
      } else {
        console.log('Branch selection modal dismissed — no selection made');
      }
    });
  }
}
