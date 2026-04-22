import { Routes } from '@angular/router';
import { routesStrings } from '../../../shared/routes';
export const categoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./category').then((m) => m.Category),
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full',
      },
      {
        path: routesStrings.category.list,
        loadComponent: () =>
          import('./category-list/category-list').then(
            (m) => m.CategoryList,
          )
      },
      {
        path: routesStrings.category.create,
        loadComponent: () =>
          import('./category-create/category-create').then(
            (m) => m.CategoryCreate,
          )
      },


    ],
  },
];
