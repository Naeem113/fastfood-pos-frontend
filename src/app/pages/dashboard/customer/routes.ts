import { Routes } from '@angular/router';
export const customerRoutes: Routes = [
  {
    path: 'customers',
    loadComponent: () =>
      import('./customer').then((m) => m.Customer),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./customer-list/customer-list').then(
            (m) => m.CustomerList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./customer-create/customer-create').then(
            (m) => m.CustomerCreate,
          )
      },


    ],
  },
];
