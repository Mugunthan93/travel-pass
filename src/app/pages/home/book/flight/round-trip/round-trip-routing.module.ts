import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoundTripPage } from './round-trip.page';

const routes: Routes = [
  {
    path: '',
    component: RoundTripPage,
    children: [
      {
        path: 'domestic',
        loadChildren: () => import('./domestic/domestic.module').then(m => m.DomesticPageModule)
      },
      {
        path: 'international',
        loadChildren: () => import('./international/international.module').then(m => m.InternationalPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoundTripPageRoutingModule {}
