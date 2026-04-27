import { Routes } from '@angular/router';
export const itemRoutes: Routes = [
  {
    path: 'items',
    loadComponent: () =>
      import('./items').then((m) => m.Items),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./items-list/items-list').then(
            (m) => m.ItemsList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./items-create/items-create').then(
            (m) => m.ItemsCreate,
          )
      },


    ],
  },
];
