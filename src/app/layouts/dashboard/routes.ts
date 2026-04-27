import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { categoryRoutes } from '../../pages/dashboard/category/routes';
import { waiterRoutes } from '../../pages/dashboard/waiter/routes';
import { tableRoutes } from '../../pages/dashboard/table/routes';
import { itemRoutes } from '../../pages/dashboard/items/routes';
export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./../../pages/dashboard/main/main').then(
            (m) => m.Main,
          )
      },

      {
        path: 'menu',
        canActivate: [AuthGuard],
          children: [
          ...categoryRoutes,
          ...itemRoutes
          ]
      },

      ...waiterRoutes,
      ...tableRoutes

    ],
  },
];
