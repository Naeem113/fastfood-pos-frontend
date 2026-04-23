import { Component, inject, signal } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { form, FormField } from '@angular/forms/signals';
import { CoverColorPicker } from '../../../../shared/components/dashboard/cover-color-picker/cover-color-picker';
import { MediaPicker } from '../../../../shared/components/dashboard/media-picker/media-picker';
import { routesStrings } from '../../../../shared/routes';
import { categoryFormModel, categorySchema } from '../../category/form';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { tableFormModel, tableSchema } from '../form';
import { FloatingInput } from '../../../../shared/ui/floating-input/floating-input';
import { FloatingSelect } from '../../../../shared/ui/floating-select/floating-select';

@Component({
  selector: 'app-table-create',
  imports: [...COMMON_IMPORTS, FormField, CoverColorPicker, MediaPicker, FloatingInput],
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

  // ========================
  // inject services & stores
  // ========================
  router = inject(Router);
  apiService = inject(ApiService)


  saveTable() {
    this.formSubmitted.set(true);
    if(this.loading() || this.tableForm().invalid()) {
      return;
    }
    this.loading.set(true);
  }

  goToTables() {
    this.router.navigate([this.routesStrings.table.list]);
  }
}
