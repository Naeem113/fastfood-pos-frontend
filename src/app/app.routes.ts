import { Routes } from '@angular/router';
import { authRoutes } from './layouts/auth/routes';
import { dashboardRoutes } from './layouts/dashboard/routes';

export const routes: Routes = [
  ...authRoutes,
  ...dashboardRoutes,
];
