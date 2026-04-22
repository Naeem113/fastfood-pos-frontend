import { Routes } from '@angular/router';
import { LoginGuard } from '../../shared/guards/login.guard';
import { AuthGuard } from '../../shared/guards/auth.guard';
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
      }
    ],
  },
];
