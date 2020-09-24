import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainPage } from './train.page';

const routes: Routes = [
  {
    path: '',
    component: TrainPage,
    children: [
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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainPageRoutingModule {}
