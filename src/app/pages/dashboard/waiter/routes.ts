import { Routes } from '@angular/router';
export const waiterRoutes: Routes = [
  {
    path: 'waiters',
    loadComponent: () =>
      import('./waiter').then((m) => m.Waiter),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./waiter-list/waiter-list').then(
            (m) => m.WaiterList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./waiter-create/waiter-create').then(
            (m) => m.WaiterCreate,
          )
      },


    ],
  },
];
