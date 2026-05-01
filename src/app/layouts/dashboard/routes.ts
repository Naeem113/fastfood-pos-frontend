import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { categoryRoutes } from '../../pages/dashboard/category/routes';
import { waiterRoutes } from '../../pages/dashboard/waiter/routes';
import { tableRoutes } from '../../pages/dashboard/table/routes';
import { itemRoutes } from '../../pages/dashboard/items/routes';
import { riderRoutes } from '../../pages/dashboard/rider/routes';
import { kitchenStationRoutes } from '../../pages/dashboard/kitchen-station/routes';
import { floorHallRoutes } from '../../pages/dashboard/floor-hall/routes';
import { customerRoutes } from '../../pages/dashboard/customer/routes';
import { discountRoutes } from '../../pages/dashboard/discount/routes';
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
      {
        path: 'sales-and-returns',
        canActivate: [AuthGuard],
          children: [
          ...customerRoutes,
          ...discountRoutes
          ]
      },
      {
        path: 'restaurant-setup',
        canActivate: [AuthGuard],
          children: [
            ...riderRoutes,
            ...tableRoutes,
            ...waiterRoutes,
            ...floorHallRoutes,
            ...kitchenStationRoutes,
          ]
      },
      {
        path: 'shift-history',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./../../pages/dashboard/shift-history/shift-history').then(
            (m) => m.ShiftHistory,
          )
      },
    ],
  },
];
