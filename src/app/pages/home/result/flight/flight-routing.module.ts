import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightPage } from './flight.page';
import { OneWayPage } from './one-way/one-way.page';
import { RoundTripPage } from './round-trip/round-trip.page';
import { MultiCityPage } from './multi-city/multi-city.page';

const routes: Routes = [
  {
    path: '',
    component: FlightPage,
    children:[
      {
        path: 'one-way',
        // loadChildren: () => import('./one-way/one-way.module').then( m => m.OneWayPageModule)
        component:OneWayPage
      },
      {
        path: 'round-trip',
        // loadChildren: () => import('./round-trip/round-trip.module').then( m => m.RoundTripPageModule)
        component:RoundTripPage
      },
      {
        path: 'multi-city',
        // loadChildren: () => import('./multi-city/multi-city.module').then( m => m.MultiCityPageModule)
        component:MultiCityPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightPageRoutingModule {}
