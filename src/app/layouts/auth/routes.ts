import { Routes } from '@angular/router';
import { LoginGuard } from '../../shared/guards/login.guard';
import { AuthGuard } from '../../shared/guards/auth.guard';
export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth').then((m) => m.Auth),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        canActivate: [LoginGuard],
        loadComponent: () =>
          import('./login/login').then(
            (m) => m.Login,
          ),
        data: { animation: 'LoginPage' }
      },
      {
        path: 'launcher',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./launcher/launcher').then(
            (m) => m.Launcher,
          )

      }
    ],
  },
];
