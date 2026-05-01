import { Routes } from '@angular/router';
export const discountRoutes: Routes = [
  {
    path: 'discounts',
    loadComponent: () =>
      import('./discount').then((m) => m.Discount),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./discount-list/discount-list').then(
            (m) => m.DiscountList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./discount-create/discount-create').then(
            (m) => m.DiscountCreate,
          )
      },


    ],
  },
];
