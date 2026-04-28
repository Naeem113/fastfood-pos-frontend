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
  selector: 'app-items-list',
  imports: [...COMMON_IMPORTS, ContentHeader, GridListHeader, ...PRIME_NG_IMPORTS],
  templateUrl: './items-list.html',
  styleUrl: './items-list.scss',
})
export class ItemsList {

  router = inject(Router);
  confirmService = inject(ConfirmService);
  //filter
  isActiveStatus = true
  cols!: TableColumn[];
  selectedItems!: any[] | null;
  items = [
    {
      sku: 'p-0001',
      name: 'Chicken Burger',
      description: 'Product Description',
      image: 'https://i0.wp.com/flaevor.com/wp-content/uploads/2022/04/SambalFriedChickenBurger1.jpg?resize=1024%2C830&ssl=1',
      category: 'Burger',
      price: 240,
      isActive: true,
    }, {
      sku: 'p-0001',
      name: 'Chicken Burger',
      description: 'Product Description',
      image: 'https://i0.wp.com/flaevor.com/wp-content/uploads/2022/04/SambalFriedChickenBurger1.jpg?resize=1024%2C830&ssl=1',
      category: 'Burger',
      price: 240,
      isActive: true,
    }, {
      sku: 'p-0001',
      name: 'Chicken Burger',
      description: 'Product Description',
      image: 'https://i0.wp.com/flaevor.com/wp-content/uploads/2022/04/SambalFriedChickenBurger1.jpg?resize=1024%2C830&ssl=1',
      category: 'Burger',
      price: 240,
      isActive: true,
    }, {
      sku: 'p-0001',
      name: 'Chicken Burger',
      description: 'Product Description',
      image: 'https://i0.wp.com/flaevor.com/wp-content/uploads/2022/04/SambalFriedChickenBurger1.jpg?resize=1024%2C830&ssl=1',
      category: 'Burger',
      price: 240,
      isActive: true,
    }]

  goToCreateItem(){
    this.router.navigate([routesStrings.menu.item.create])
  }

    onSelectionDelete() {
    this.confirmService.delete(
      async () => {
        // Perform delete action here, e.g., call API to delete selected products
        console.log('Deleting products:', this.selectedItems);
        // After deletion, clear the selection
        this.selectedItems = null;
      }, `Are you sure you want to delete the selected ${this.selectedItems?.length} products?`);

  }

  editProduct() {
    this.goToCreateItem();
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
