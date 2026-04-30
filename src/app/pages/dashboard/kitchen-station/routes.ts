import { Routes } from '@angular/router';
export const kitchenStationRoutes: Routes = [
  {
    path: 'kitchen-stations',
    loadComponent: () =>
      import('./kitchen-station').then((m) => m.KitchenStation),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./kitchen-station-list/kitchen-station-list').then(
            (m) => m.KitchenStationList,
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./kitchen-station-create/kitchen-station-create').then(
            (m) => m.KitchenStationCreate,
          )
      },


    ],
  },
];
