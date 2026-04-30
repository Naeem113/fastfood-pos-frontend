import { Routes } from '@angular/router';
export const riderRoutes: Routes = [
  {
    path: 'riders',
    loadComponent: () =>
      import('./rider').then((m) => m.Rider),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./rider-list/rider-list').then(
            (m) => m.RiderList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./rider-create/rider-create').then(
            (m) => m.RiderCreate,
          )
      },


    ],
  },
];
