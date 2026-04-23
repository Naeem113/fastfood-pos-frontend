import { Component, computed, inject, signal } from '@angular/core';
import { Category, ModalService } from '../../../../../core/services/modal.service';
import { COMMON_IMPORTS } from '../../../../common';
import { Modal } from '../../../../ui/modal/modal';

@Component({
  selector: 'app-parent-category-modal',
  imports: [...COMMON_IMPORTS, Modal],
  templateUrl: './parent-category-modal.html',
  styleUrls: ['./parent-category-modal.scss'],
})
export class ParentCategoryModal {
  private modalService = inject(ModalService);

  // Signals
  readonly isOpen = this.modalService.isOpen;
  readonly config = this.modalService.config;

  searchQuery = signal('');
  selectedCategory = signal<Category | null>(null);

  // Hardcoded categories — in real app, pass via config.data or a CategoryService
  private allCategories = signal<Category[]>([
    { id: 'none', name: 'None', icon: 'block' },
    { id: 'pizza', name: 'Pizza', icon: 'local_pizza' },
    { id: 'burgers', name: 'Burgers', icon: 'lunch_dining' },
    { id: 'sushi', name: 'Sushi', icon: 'set_meal' },
  ]);

  filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allCategories().filter(c =>
      c.name.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    // Pre-select "None" by default
    this.selectedCategory.set(this.allCategories()[0]);
  }

  select(category: Category) {
    this.selectedCategory.set(category);
  }

  done() {
    this.modalService.confirm<Category>(this.selectedCategory()!);
  }

  close() {
    this.modalService.dismiss();
  }

  isSelected(category: Category): boolean {
    return this.selectedCategory()?.id === category.id;
  }
}
