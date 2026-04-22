import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { routesStrings } from '../../../../shared/routes';

@Component({
  selector: 'app-category-create',
  imports: [RouterLink],
  templateUrl: './category-create.html',
  styleUrls: ['./category-create.scss'],
})
export class CategoryCreate {
  router = inject(Router);
  routesStrings =  routesStrings

  goToCategories() {
    this.router.navigate([this.routesStrings.category.list]);
  }
}
