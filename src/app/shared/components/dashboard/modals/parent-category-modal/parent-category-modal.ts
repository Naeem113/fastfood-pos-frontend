import { Component, computed, inject, signal } from '@angular/core';
import { Category, ModalService } from '../../../../../core/services/modal.service';
import { COMMON_IMPORTS } from '../../../../common';
import { Modal } from '../../../../ui/modal/modal';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-parent-category-modal',
  imports: [...COMMON_IMPORTS, Modal],
  templateUrl: './parent-category-modal.html',
  styleUrls: ['./parent-category-modal.scss'],
})
export class ParentCategoryModal {

  config = inject(DynamicDialogConfig);
  searchQuery = signal('');
  selectedCategory = signal<Category[]>([]);

  // Hardcoded categories — in real app, pass via config.data or a CategoryService
  private allCategories = signal<Category[]>([
    { id: 'pizza', name: 'Pizza', icon: 'local_pizza' },
    { id: 'burgers', name: 'Burgers', icon: 'lunch_dining' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },

  ]);

  filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allCategories().filter(c =>
      c.name.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    const ids: string[] = this.config.data?.value || [];
    const isMulti = this.config.data?.multiselect;

    const selected = this.allCategories().filter(b => ids.includes(b.id));

    this.selectedCategory.set(isMulti ? selected : selected.slice(0, 1));
  }

    select(branch: Category) {
      const isMulti = this.config.data?.multiSelect;

      if (isMulti) {
        const current = this.selectedCategory();

        const exists = current.find(b => b.id === branch.id);

        if (exists) {
          // ❌ remove if already selected
          this.selectedCategory.set(current.filter(b => b.id !== branch.id));
        } else {
          // ✅ add
          this.selectedCategory.set([...current, branch]);
        }

      } else {
        // ✅ single select
        this.selectedCategory.set([branch]);
      }
    }

    isSelected(branch: Category): boolean {
      return this.selectedCategory().some(b => b.id === branch.id);
    }
}
