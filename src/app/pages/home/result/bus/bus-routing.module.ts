import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusPage } from './bus.page';

const routes: Routes = [
  {
    path: '',
    component: BusPage
  },
  {
    path: 'select-seat',
    loadChildren: () => import('./select-seat/select-seat.module').then( m => m.SelectSeatPageModule)
  },
  {
    path: 'select-drop-and-pickup',
    loadChildren: () => import('./select-drop-and-pickup/select-drop-and-pickup.module').then( m => m.SelectDropAndPickupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusPageRoutingModule {}
