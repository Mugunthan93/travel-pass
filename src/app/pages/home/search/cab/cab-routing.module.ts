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
        path: 'half-day',
        loadChildren: () => import('./half-day/half-day.module').then( m => m.HalfDayPageModule)
      },
      {
        path: 'full-day',
        loadChildren: () => import('./full-day/full-day.module').then( m => m.FullDayPageModule)
      },
      {
        path: 'airport',
        loadChildren: () => import('./airport/airport.module').then( m => m.AirportPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CabPageRoutingModule {}
