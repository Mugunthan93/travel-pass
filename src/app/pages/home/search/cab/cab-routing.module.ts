import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CabPage } from './cab.page';

const routes: Routes = [
  {
    path: '',
    component: CabPage,
    children : [
      {
        path: 'one-way',
        loadChildren: () => import('./one-way/one-way.module').then( m => m.OneWayPageModule)
      },
      {
        path: 'round-trip',
        loadChildren: () => import('./round-trip/round-trip.module').then( m => m.RoundTripPageModule)
      },
      {
        path: 'multi-city',
        loadChildren: () => import('./multi-city/multi-city.module').then( m => m.MultiCityPageModule)
      },
      {
        path: 'airport',
        loadChildren: () => import('./airport/airport.module').then( m => m.AirportPageModule)
      },
      {
        path: 'local',
        loadChildren: () => import('./local/local.module').then( m => m.LocalPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabPageRoutingModule {}
