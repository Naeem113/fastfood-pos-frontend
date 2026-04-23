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

@Component({
  selector: 'app-category-create',
  imports: [...COMMON_IMPORTS, FormField, CoverColorPicker, MediaPicker, ParentCategoryModal],
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
    const result = await this.modalService.open<Category>({
      title: 'Parent category',
      subtitle: 'Select a parent category to nest this category underneath it.',
    });

    if (result.confirmed && result.value) {
      this.selectedCategory = result.value;
      console.log('User selected:', result.value);
    } else {
      console.log('Modal dismissed — no selection made');
    }
  }
}
