import { Routes } from '@angular/router';
import { routesStrings } from '../../../shared/routes';
export const categoryRoutes: Routes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./category').then((m) => m.Category),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./category-list/category-list').then(
            (m) => m.CategoryList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./category-create/category-create').then(
            (m) => m.CategoryCreate,
          )
      },


    ],
  },
];
