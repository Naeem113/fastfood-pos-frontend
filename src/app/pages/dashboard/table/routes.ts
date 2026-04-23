import { Routes } from '@angular/router';
export const tableRoutes: Routes = [
  {
    path: 'tables',
    loadComponent: () =>
      import('./table').then((m) => m.Table),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./table-list/table-list').then(
            (m) => m.TableList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./table-create/table-create').then(
            (m) => m.TableCreate,
          )
      },


    ],
  },
];
