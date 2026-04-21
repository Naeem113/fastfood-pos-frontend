import { Routes } from '@angular/router';
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
        loadComponent: () =>
          import('./login/login').then(
            (m) => m.Login,
          )
      }
    ],
  },
];
