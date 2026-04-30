import { Routes } from '@angular/router';
export const floorHallRoutes: Routes = [
  {
    path: 'floor-halls',
    loadComponent: () =>
      import('./floor-hall').then((m) => m.FloorHall),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./floor-hall-list/floor-hall-list').then(
            (m) => m.FloorHallList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./floor-hall-create/floor-hall-create').then(
            (m) => m.FloorHallCreate,
          )
      },


    ],
  },
];
