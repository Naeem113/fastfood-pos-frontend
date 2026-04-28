import { Component, inject } from '@angular/core';
import { COMMON_IMPORTS } from '../../../../shared/common';
import { ContentHeader } from '../../../../shared/components/dashboard/content-header/content-header';
import { Router } from '@angular/router';
import { routesStrings } from '../../../../shared/routes';
import { GridListHeader } from '../../../../shared/components/dashboard/grid-list-header/grid-list-header';
import { PRIME_NG_IMPORTS } from '../../../../shared/primeng';
import { ConfirmService } from '../../../../core/services/confirm-dialog.service';
import { TableColumn } from '../../../../shared/interfaces/tableColumn';

@Component({
  selector: 'app-category-list',
  imports: [...COMMON_IMPORTS, ContentHeader, GridListHeader, ...PRIME_NG_IMPORTS],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {

  router = inject(Router)
  confirmService = inject(ConfirmService)
  //filter
  isActiveStatus = true
  cols!: TableColumn[];
  selectedProducts!: any[] | null;
  products = [
    {
      id: '1000',
      name: 'Pizza',
      description: 'Product Description',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTytpqBakUgp5FnLM_Ezyoq0xKzEUP8qq_I2w&s',
      parentCategory: '-',
      quantity: 24,
      status: 'Active',
    }, {
      id: '1000',
      name: 'Burger',
      description: 'Product Description',
      image: 'https://i0.wp.com/flaevor.com/wp-content/uploads/2022/04/SambalFriedChickenBurger1.jpg?resize=1024%2C830&ssl=1',
      parentCategory: '-',
      quantity: 24,
      status: 'Active',
    }, {
      id: '1000',
      name: 'Shawarma',
      description: 'Product Description',
      image: 'https://pekis.net/sites/default/files/styles/social_share_1200/public/2025-04/Shawarma.webp?itok=TeUFSs0R',
      parentCategory: '-',
      quantity: 24,
      status: 'Active',
    }, {
      id: '1000',
      name: 'Pasta',
      description: 'Product Description',
      image: 'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Puttanesca-fd5810c.jpg?quality=90&resize=708,643',
      parentCategory: '-',
      quantity: 24,
      status: 'Active',
    }]



  toggleIsActiveStatus() {
    this.isActiveStatus = !this.isActiveStatus;
  }

  goToCreateCategory() {
    this.router.navigate([routesStrings.menu.category.create])
  }

  onSelectionDelete() {
    this.confirmService.delete(
      async () => {
        // Perform delete action here, e.g., call API to delete selected products
        console.log('Deleting products:', this.selectedProducts);
        // After deletion, clear the selection
        this.selectedProducts = null;
      }, `Are you sure you want to delete the selected ${this.selectedProducts?.length} products?`);

  }

  editProduct() {
    this.router.navigate([routesStrings.menu.category.create])
  }

  deleteProduct() {
    this.confirmService.delete(
      async () => {
        // Perform delete action here, e.g., call API to delete the product
        console.log('Deleting product');
      },
      'Are you sure you want to delete this product?'
    );
  }
}
