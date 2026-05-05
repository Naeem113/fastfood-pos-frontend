import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { categoryRoutes } from '../../pages/dashboard/category/routes';
import { waiterRoutes } from '../../pages/dashboard/waiter/routes';
import { tableRoutes } from '../../pages/dashboard/table/routes';
import { itemRoutes } from '../../pages/dashboard/items/routes';
export const POSRoutes: Routes = [
  {
    path: 'pos',
    loadComponent: () =>
      import('./pos').then((m) => m.Pos),
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./../../pages/pos/main/main').then(
            (m) => m.Main,
          )
      },
      {
        path: 'start',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./../../pages/pos/start/start').then(
            (m) => m.Start,
          )
      },
      {
        path: 'dine-in',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./../../pages/pos/dine-in/dine-in').then(
            (m) => m.DineIn,
          )
      },
      {
        path: 'cart',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./../../pages/pos/cart/cart').then(
            (m) => m.Cart,
          )
      }
    ],
  },
];
